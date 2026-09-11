// Compile the contracts into TypeScript.
//
//   openapi/<service>/<version>/openapi.yaml
//       → gen/<service>/<version>/schema.ts   verbatim openapi-typescript output
//       → gen/<service>/<version>/client.ts   a client bound to the contract's address
//       → gen/<service>/<version>/index.ts    aliases (<Operation>Result / Body / Query)
//       → gen/index.ts                        one namespace per service
//
// # One file per service, no bundling step
//
// The contracts were once split by OpenAPI node type: paths/<Tag>.yaml plus
// schemas/<Name>.yaml, one schema per file. compute came out as 74 schema files of about
// thirty lines each. That is modular in form only; in practice it turned "change one
// endpoint" into a walk across a dozen files.
//
// The largest contract is now 169 KB. One file fits in an editor, greps in one pass, and
// reviews as a whole. If a single service ever outgrows that, split that one — it is that
// service's problem, not all thirteen contracts'.
//
// # The only runtime this package ships is client()
//
// It once shipped src/client.ts: a wrapper over openapi-fetch that injected Authorization
// and packed seven services behind one createClient({ baseUrl }). That layer was wrong in
// two specific ways, and both still hold:
//
//   - Each service has its own host (iam.leaflow.cloud, compute.leaflow.cloud), not a
//     gateway plus a path prefix. The console's lib/services.ts records the reason: IAM
//     and monitoring both claim /api/v1/projects/{id}/..., so the target of a call cannot
//     be recovered from its path. One baseUrl for seven services assumes something untrue.
//   - Clients are built per call (call() in lib/session/iam.ts), because a token belongs
//     to whoever is asking, not to the process. createClient() built seven at once and
//     wasted six.
//
// What client() does is narrower: it fills in baseUrl from the contract's servers[0], and
// nothing else. Every service keeps its own factory, so the first point holds; the factory
// is cheap and holds no state, so the second one does too.
//
// Authorization stays with the caller — that is openapi-fetch middleware, and the token
// comes from a session the caller owns:
//
//     import { compute } from '@leaflow/sdk';
//     const api = compute.client();
//     api.use({ onRequest: ({ request }) => { request.headers.set('Authorization', ...); return request; } });
//
// # Aliases are generated, not written
//
// The raw openapi-typescript output requires
//
//     operations['list-instances']['responses'][200]['content']['application/json']
//
// where this SDK offers compute.ListInstancesResult, which the console uses throughout
// (app/console/*/types.ts). That layer earns its keep, but it is derived mechanically from
// operationId — so generate it.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractsRoot = process.env.CONTRACTS_DIR
  ? resolve(process.env.CONTRACTS_DIR)
  : join(root, "leaflowapis");
// leaflow/ is the namespace directory, matching googleapis' google/.
const contracts = join(contractsRoot, "leaflow");
const output = join(root, "gen");

// The contracts are cloned here; the revision is pinned in CONTRACTS_REF.
//
// A language repository is a product of the contracts, and a product should not hold a git
// pointer back at its source. That is what a submodule does, and it buys four classes of
// CI-only failure, none of which report themselves as a submodule problem.
const ref = existsSync(join(root, "CONTRACTS_REF"))
  ? readFileSync(join(root, "CONTRACTS_REF"), "utf8").trim()
  : "main";
if (!process.env.CONTRACTS_DIR) {
  rmSync(contractsRoot, { recursive: true, force: true });
  // HTTPS by default: CI has no ssh, and an SSH URL fails with a bare exit status 128 that
  // says nothing about authentication.
  const remote = process.env.CONTRACTS_REMOTE ?? "https://github.com/leaflowapis/leaflowapis.git";
  execFileSync("git", ["clone", "--quiet", "--no-tags", remote, contractsRoot], {
    stdio: "inherit",
  });
  execFileSync("git", ["-C", contractsRoot, "checkout", "--quiet", ref], { stdio: "inherit" });
  console.log(`contracts ${ref} → leaflowapis/`);
} else {
  console.log(`本地契约 → ${contractsRoot}`);
}

const METHODS = ["get", "post", "put", "patch", "delete", "options", "head", "trace"];
const JSON_MEDIA = "application/json";

// openapi/<service>/<version>/openapi.yaml
const contractList = readdirSync(contracts, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) =>
    readdirSync(join(contracts, entry.name), { withFileTypes: true })
      .filter((version) => version.isDirectory())
      .map((version) => ({
        service: entry.name,
        version: version.name,
        spec: join(contracts, entry.name, version.name, "openapi.yaml"),
      })),
  )
  // type/ holds shared shapes rather than a service, and has no openapi.yaml.
  .filter((entry) => existsSync(entry.spec))
  .sort((a, b) => a.service.localeCompare(b.service) || a.version.localeCompare(b.version));

if (contractList.length === 0) {
  console.error(`no contracts under ${contracts}`);
  process.exit(1);
}

/** list-instances → ListInstances */
function pascal(operationId) {
  return operationId
    .split(/[-_./\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

/**
 * The status code this operation returns on success.
 *
 * The lowest 2xx wins: an operation has exactly one success shape, and 200/201/202 are
 * three ways of saying so. Operations carrying no JSON body (204, a bare 202) return null,
 * because there is no Result to name.
 */
function successStatus(operation) {
  const codes = Object.keys(operation.responses ?? {})
    .filter((code) => /^2\d\d$/.test(code))
    .filter((code) => operation.responses[code]?.content?.[JSON_MEDIA])
    .sort();
  return codes[0] ?? null;
}

// Wipe before generating.
//
// Overwriting leaves debris: rename a schema and the old .ts stays behind, still compiling
// and still published. This is not hypothetical — clean-generated.mjs in this SDK records
// the 584 orphaned files left by the v0.1.0 → v0.2.0 rename.
//
// Deleting first means one contract always yields one tree, however many times it runs.
rmSync(output, { recursive: true, force: true });

const services = [];

for (const { service, version, spec } of contractList) {
  const destination = join(output, service, version);
  mkdirSync(destination, { recursive: true });

  // --default-non-nullable false: a default does not make a field required.
  //
  // Without it every field carrying `default` is generated as required, while Go generates
  // a pointer (`Most *int64`) from the same contract. Two languages reach opposite
  // conclusions about one field, and the contract says neither — it says optional, with a
  // server-side default. 38 fields across the contracts are like this.
  //
  // It surfaces in few places, because most fields are always sent by a form and the
  // required-ness never shows. The one that broke was the address-expansion button, which
  // carries no body at all, so `{}` failed to type-check.
  execFileSync(
    "npx",
    [
      "openapi-typescript",
      spec,
      "--default-non-nullable",
      "false",
      "-o",
      join(destination, "schema.ts"),
    ],
    { stdio: "inherit" },
  );

  // Aliases come from the operationId in the YAML, not from parsing the generated .ts. The
  // shape of that file belongs to openapi-typescript and moves with its version;
  // operationId belongs to the contract.
  //
  // Parsed in Node, not python. A python3 process was once spawned to convert the YAML, on
  // the grounds that the Go generator is python too and both should read one file the same
  // way. Splitting the repositories removed that premise and left this repository requiring
  // a python runtime it does not have on a slim node image (spawnSync python3 ENOENT).
  const aliases = [];
  const document = parseYaml(readFileSync(spec, "utf8"));

  // 有默认地址时沿用契约；没有时由调用方明确传入 baseUrl。
  const server = document.servers?.[0]?.url;

  for (const [path, item] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(item)) {
      if (!METHODS.includes(method) || !operation.operationId) continue;
      const name = pascal(operation.operationId);
      const key = JSON.stringify(operation.operationId);

      const status = successStatus(operation);
      if (status) {
        aliases.push(
          `/** The success response body of \`${method.toUpperCase()} ${path}\`. */`,
          `export type ${name}Result =`,
          `  operations[${key}]["responses"][${status}]["content"]["application/json"];`,
          "",
        );
      }
      if ((operation.parameters ?? []).some((p) => p.in === "query")) {
        aliases.push(
          `/** The query parameters of \`${method.toUpperCase()} ${path}\`. */`,
          `export type ${name}Query =`,
          `  operations[${key}]["parameters"]["query"];`,
          "",
        );
      }
      if (operation.requestBody?.content?.[JSON_MEDIA]) {
        aliases.push(
          `/** The request body of \`${method.toUpperCase()} ${path}\`. */`,
          `export type ${name}Body = NonNullable<`,
          `  operations[${key}]["requestBody"]`,
          `>["content"]["application/json"];`,
          "",
        );
      }
    }
  }

  // The address is closed over by the factory rather than exported as a constant. Having
  // the caller name it once more turns a value the contract already settled into one more
  // parameter that can be got wrong — and a wrong one is a well-formed URL pointing
  // somewhere else, which no type checker can catch.
  {
    writeFileSync(
      join(destination, "client.ts"),
      `${[
        "// Code generated from the contract's servers[0]. DO NOT EDIT.",
        "",
        'import createClient, { type ClientOptions } from "openapi-fetch";',
        "",
        'import type { paths } from "./schema.js";',
        "",
        ...(server ? [`const defaultBaseUrl = ${JSON.stringify(server)};`, ""] : []),
        "",
        `/** A client for the ${service} service. Pass baseUrl to override the address. */`,
        server
          ? "export function client(options: ClientOptions = {}) {"
          : "export function client(options: ClientOptions & { baseUrl: string }) {",
        server
          ? "  return createClient<paths>({ baseUrl: defaultBaseUrl, ...options });"
          : "  return createClient<paths>(options);",
        "}",
      ].join("\n")}\n`,
    );
  }

  writeFileSync(
    join(destination, "index.ts"),
    `${[
      "// Code generated by scripts/generate.mjs. DO NOT EDIT.",
      "//",
      "// The aliases replace the operations[...] subscript chain with a name. The raw paths /",
      "// components / operations are exported as well: paths is what createClient<paths>() takes.",
      "",
      'export type { paths, components, operations, webhooks } from "./schema.js";',
      "",
      'export { client } from "./client.js";',
      "",
      'import type { operations } from "./schema.js";',
      "",
      ...aliases,
    ]
      .join("\n")
      .trimEnd()}\n`,
  );

  services.push({ service, version, server });
  console.log(
    `${service}/${version} → gen/${service}/${version}  ` +
      `${aliases.filter((line) => line.startsWith("export type")).length} aliases`,
  );
}

// The barrel: import { compute } from '@leaflow/sdk', which is how the console uses it.
writeFileSync(
  join(output, "index.ts"),
  `${[
    "// Code generated by scripts/generate.mjs. DO NOT EDIT.",
    "//",
    "// One namespace per service, never flattened: compute and tunnel each declare an",
    "// OperationLogResource, and they are different types. Flattening lets the first one",
    "// declared shadow the other, silently — which surfaces as an endpoint whose fields do not",
    "// match its type, and reads like a bug in the backend.",
    "//",
    "// A namespace carries client() as well as types, hence `export * as` rather than",
    "// `export type * as`; sideEffects: false keeps unused services out of a bundle.",
    "",
    ...services.map(
      ({ service, version }) => `export * as ${service} from "./${service}/${version}/index.js";`,
    ),
  ].join("\n")}\n`,
);

console.log(`gen/index.ts → ${services.map((s) => s.service).join(", ")}`);

// 导出路径随契约生成，新增服务后包安装者能直接导入该服务。
const packagePath = join(root, "package.json");
const manifest = JSON.parse(readFileSync(packagePath, "utf8"));
manifest.exports = {
  ".": { types: "./dist/index.d.ts", default: "./dist/index.js" },
  ...Object.fromEntries(
    services.map(({ service, version }) => [
      `./${service}/${version}`,
      {
        types: `./dist/${service}/${version}/index.d.ts`,
        default: `./dist/${service}/${version}/index.js`,
      },
    ]),
  ),
};
writeFileSync(packagePath, JSON.stringify(manifest, null, 2) + "\n");

// Format the output.
//
// Three generators write into gen/: openapi-typescript for schema.ts, and the two template
// literals above. They do not agree on quoting or line width, and the difference lands in
// every review as noise. Running one formatter over the tree afterwards settles it, and
// makes "the generated code is up to date" a diff that can be checked in CI.
execFileSync("npx", ["prettier", "--write", "--log-level", "warn", output], { stdio: "inherit" });
console.log("gen/ formatted");
