import { existsSync, globSync, readFileSync, writeFileSync } from "node:fs";
import { posix } from "node:path";
import { defineConfig, isVerb } from "orval";
import { format } from "prettier";
import { parse } from "yaml";
import ts from "typescript";

const contracts = process.env.CONTRACTS_DIR ?? "./leaflowapis";
const modules = globSync(["**/*.yaml", "**/*.yml"], {
  cwd: `${contracts}/leaflow`,
})
  .sort()
  .map((path) => ({ path, document: parse(readFileSync(`${contracts}/leaflow/${path}`, "utf8")) }))
  .filter(({ document }) => document?.openapi)
  .map(({ path, document }) => {
    const spec = path.replaceAll("\\", "/");
    const parent = posix.dirname(spec);
    const version = posix.basename(parent);
    const module = /^openapi\.ya?ml$/.test(posix.basename(spec))
      ? parent
      : /^v\d+$/.test(version)
        ? posix.join(posix.dirname(parent), posix.parse(spec).name, version)
        : posix.join(parent, posix.parse(spec).name);
    return [`leaflow/${spec}`, module, Boolean(document.servers?.length), document];
  });

const activeContracts = new Set(modules.map(([, module]) => module.replace(/\/v\d+$/, "")));

const routeModules = new Map();

function zodInput(document) {
  // Orval 的 Zod 生成器忽略 QUERY 操作；只转换独立副本，不改变 fetch 和路由事实。
  const copy = structuredClone(document);
  for (const [path, item] of Object.entries(copy.paths ?? {})) {
    if (!item.query) continue;
    const method = ["post", "put", "patch", "delete", "options", "head", "get", "trace"].find(
      (method) => !Object.hasOwn(item, method),
    );
    if (!method) throw new Error(`No free Zod generation method for QUERY ${path}`);
    item[method] = item.query;
    delete item.query;
  }
  return copy;
}

function responseClient(module) {
  return (clients) => ({
    ...clients.fetch,
    async client(verb, options) {
      const generated = await clients.fetch.client(verb, options);
      const code = generated.implementation;
      const syntax = ts.createSourceFile("functions.ts", code, ts.ScriptTarget.ESNext, true);
      const statement = syntax.statements.find(
        (statement) =>
          ts.isVariableStatement(statement) &&
          statement.declarationList.declarations[0]?.name.getText(syntax) === verb.operationName,
      );
      const block = statement?.declarationList.declarations[0]?.initializer?.body;
      const variable = (statement, name) =>
        ts.isVariableStatement(statement) &&
        statement.declarationList.declarations[0]?.name.getText(syntax) === name;
      const response = block?.statements.find((statement) => variable(statement, "res"));
      // 流式响应没有正文解码，保留生成器的原生流接口。
      if (!response) return generated;
      const data = block.statements.find((statement) => variable(statement, "data"));
      const returned = block.statements.find(ts.isReturnStatement);
      if (
        !data ||
        !returned ||
        !block.statements
          .slice(block.statements.indexOf(response) + 1, block.statements.indexOf(returned))
          .every((statement) =>
            ["contentType", "body", "data"].some((name) => variable(statement, name)),
          )
      )
        throw new Error("Unexpected Orval response decoding structure");
      const declaration = data.declarationList.declarations[0];
      const type = declaration.type.getText(syntax);
      const empty = ts.isConditionalExpression(declaration.initializer)
        ? declaration.initializer.whenFalse.getText(syntax)
        : "null";
      const modes = Object.fromEntries(
        [...verb.response.types.success, ...verb.response.types.errors].map((response) => [
          response.key,
          response.value === "Blob" || response.originalSchema?.format === "binary"
            ? "blob"
            : /json/i.test(response.contentType)
              ? "json"
              : "text",
        ]),
      );
      const decoding = `\n  const data: ${type} = await decodeResponse(res, ${JSON.stringify(modes)}, ${empty}) as ${type};\n  `;
      return {
        ...generated,
        implementation:
          code.slice(0, response.end) + decoding + code.slice(returned.getStart(syntax)),
      };
    },
    dependencies(...args) {
      return [
        ...(clients.fetch.dependencies?.(...args) ?? []),
        {
          dependency: posix.relative(`src/${module}/generated`, "src/response.js"),
          exports: [{ name: "decodeResponse", values: true }],
        },
      ];
    },
  });
}

const zod = {
  version: 4,
  variant: "classic",
  strict: { body: true, param: true, query: true, header: true },
  generate: { body: true, query: true, param: true, header: true, response: false },
  coerce: { body: false, query: false, param: false, header: false, response: false },
  generateDiscriminatedUnion: true,
  generateReusableSchemas: true,
};

export default defineConfig(
  Object.fromEntries(
    modules.flatMap(([spec, module, hasServer, source]) => {
      const schemes = Object.fromEntries(
        Object.entries(source.components?.securitySchemes ?? {}).map(([name, scheme]) => [
          name,
          scheme.$ref
            ? decodeURIComponent(scheme.$ref.split("/").at(-1))
                .replaceAll("~1", "/")
                .replaceAll("~0", "~")
            : name,
        ]),
      );
      const input = {
        target: `${contracts}/${spec}`,
        parserOptions: { externalRefs: { allow: ["*"] } },
        override: {
          transformer(document) {
            const routes = [];
            for (const [path, item] of Object.entries(document.paths ?? {})) {
              for (const [method, operation] of Object.entries(item)) {
                if (!isVerb(method)) continue;
                const security = operation.security ?? document.security ?? [];
                const required = security.filter((entry) => Object.keys(entry).length > 0);
                const optional = security.length === 2 && required.length === 1;
                if (
                  (security.length > 1 && !optional) ||
                  Object.keys(required[0] ?? {}).length > 1
                ) {
                  throw new Error(
                    `Gateway authentication is ambiguous: ${module} ${method} ${path}`,
                  );
                }
                const scheme = Object.keys(required[0] ?? {})[0];
                routes.push({
                  service: module.split("/")[0],
                  contract: module.replace(/\/v\d+$/, ""),
                  method: method.toUpperCase(),
                  path,
                  operationId: operation.operationId,
                  securityScheme: scheme ? (schemes[scheme] ?? scheme) : null,
                  ...(optional ? { securityOptional: true } : {}),
                  upstreamUrl:
                    (operation.servers ?? item.servers ?? document.servers)?.[0]?.url ?? null,
                });
              }
            }
            routeModules.set(module, routes);
            return document;
          },
        },
      };
      const hooks = {
        afterAllFilesWrite: [
          async () => {
            const entryPath = `./src/${module}/index.ts`;
            if (!existsSync(entryPath)) {
              writeFileSync(
                entryPath,
                'export * from "./generated/functions.js";\nexport * from "./generated/models.js";\nexport * as schemas from "./generated/schemas.zod.js";\n',
              );
            }
            if (module === "assistant/v1") {
              const path = `./src/${module}/generated/functions.ts`;
              const code = readFileSync(path, "utf8");
              writeFileSync(
                path,
                code.replace(
                  '"Content-Type": "application/octet-stream",\n      ...headers,',
                  '"Content-Type": "application/octet-stream",\n      ...Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, String(value)])),',
                ),
              );
            }
            const updatedContracts = new Set(
              [...routeModules.keys()].map((name) => name.replace(/\/v\d+$/, "")),
            );
            const previousCode = readFileSync("./src/routes.ts", "utf8");
            const syntax = ts.createSourceFile(
              "routes.ts",
              previousCode,
              ts.ScriptTarget.ESNext,
              true,
            );
            const declaration = syntax.statements.find(ts.isVariableStatement).declarationList
              .declarations[0];
            const array = ts.isAsExpression(declaration.initializer)
              ? declaration.initializer.expression
              : declaration.initializer;
            const previous = array.elements.map((item) =>
              Object.fromEntries(
                item.properties.map((property) => {
                  const value = property.initializer;
                  if (ts.isStringLiteral(value)) return [property.name.text, value.text];
                  if (value.kind === ts.SyntaxKind.NullKeyword) return [property.name.text, null];
                  if (value.kind === ts.SyntaxKind.TrueKeyword) return [property.name.text, true];
                  if (value.kind === ts.SyntaxKind.FalseKeyword) return [property.name.text, false];
                  throw new Error("Unexpected generated route value");
                }),
              ),
            );
            const generated = [...routeModules]
              .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
              .flatMap(([, values]) => values);
            const routes = [
              ...previous.filter(
                (route) =>
                  activeContracts.has(route.contract) && !updatedContracts.has(route.contract),
              ),
              ...generated,
            ];
            const code = `// Code generated by Orval hooks. DO NOT EDIT.\nexport const routes = ${JSON.stringify(routes)} as const;\nexport type Route = (typeof routes)[number];\n`;
            writeFileSync("./src/routes.ts", await format(code, { parser: "typescript" }));
          },
          {
            command: "prettier --write --no-error-on-unmatched-pattern",
            injectGeneratedDirsAndFiles: true,
          },
        ],
      };
      const output = {
        mode: "single",
        formatter: "prettier",
        indexFiles: false,
        tsconfig: "./tsconfig.json",
      };
      return [
        [
          `${module.replaceAll("/", "_")}_fetch`,
          {
            input,
            hooks,
            output: {
              ...output,
              target: `./src/${module}/generated/functions.ts`,
              schemas: {
                path: `./src/${module}/generated/models.ts`,
                mode: "single",
              },
              clean: module === "okdata/v1",
              client: responseClient(module),
              headers: true,
              urlEncodeParameters: true,
              ...(hasServer ? { baseUrl: { getBaseUrlFromSpecification: true, index: 0 } } : {}),
              override: { fetch: { useRuntimeFetcher: true } },
            },
          },
        ],
        [
          `${module.replaceAll("/", "_")}_zod`,
          {
            input: {
              ...input,
              override: { ...input.override, transformer: zodInput },
            },
            hooks,
            output: {
              ...output,
              target: `./src/${module}/generated/schemas.zod.ts`,
              schemas: `./src/${module}/generated/validators`,
              client: "zod",
              override: { zod },
            },
          },
        ],
      ];
    }),
  ),
);
