import { globSync, readFileSync } from "node:fs";
import { posix } from "node:path";
import { defineConfig } from "orval";
import { parse } from "yaml";

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
    return [`leaflow/${spec}`, module, Boolean(document.servers?.length)];
  });

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
    modules.flatMap(([spec, module, hasServer]) => {
      const input = {
        target: `${contracts}/${spec}`,
        parserOptions: { externalRefs: { allow: ["*"] } },
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
            output: {
              ...output,
              target: `./src/${module}/generated/functions.ts`,
              schemas: {
                path: `./src/${module}/generated/models.ts`,
                mode: "single",
              },
              clean: true,
              client: "fetch",
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
            input,
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
