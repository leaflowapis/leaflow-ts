import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { generate } from "orval";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { parse } from "yaml";
import ts from "typescript";
import { routes } from "../dist/routes.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const admin = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).name.endsWith(
  "-admin",
);
const contractName = admin ? "apis" : "leaflowapis";
const sibling = resolve(root, "..", contractName);
process.env.CONTRACTS_DIR ??= existsSync(sibling) ? sibling : resolve(root, contractName);
const { default: config } = await import("../orval.config.mjs");
const documents = new Map();
function document(file) {
  if (!documents.has(file)) documents.set(file, parse(readFileSync(file, "utf8")));
  return documents.get(file);
}
function dereference(value, file) {
  while (value?.$ref) {
    assert.doesNotMatch(value.$ref, /^https?:/, "generation tests must use local contracts only");
    const [path, pointer = ""] = value.$ref.split("#");
    file = path ? resolve(dirname(file), path) : file;
    value = document(file);
    for (const key of pointer.split("/").slice(1))
      value = value[decodeURIComponent(key).replaceAll("~1", "/").replaceAll("~0", "~")];
  }
  return { value, file };
}
const pascal = (id) =>
  id
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

const transformer = config.billing_v1_zod.input.override.transformer;
test("Zod QUERY transformation is isolated and never overwrites genuine methods", () => {
  const operation = {
    operationId: "test-query",
    requestBody: { content: { "application/json": { schema: { type: "object" } } } },
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
      { in: "query", name: "limit", schema: { type: "integer" } },
      { in: "header", name: "X-Test", schema: { type: "string" } },
    ],
  };
  const source = {
    paths: {
      "/test/{id}": {
        parameters: [{ in: "query", name: "shared", schema: { type: "string" } }],
        post: { operationId: "real-post" },
        put: { operationId: "real-put" },
        query: operation,
      },
    },
  };
  const snapshot = structuredClone(source);
  const result = transformer(source);
  assert.notEqual(result, source);
  assert.deepEqual(source, snapshot);
  assert.deepEqual(result.paths["/test/{id}"].post, source.paths["/test/{id}"].post);
  assert.deepEqual(result.paths["/test/{id}"].put, source.paths["/test/{id}"].put);
  assert.deepEqual(result.paths["/test/{id}"].patch, operation);
  assert.deepEqual(result.paths["/test/{id}"].parameters, source.paths["/test/{id}"].parameters);
  assert.equal(Object.hasOwn(result.paths["/test/{id}"], "query"), false);
  result.paths["/test/{id}"].patch.operationId = "changed-copy";
  assert.equal(source.paths["/test/{id}"].query.operationId, "test-query");
  const full = { paths: { "/full": { query: operation } } };
  for (const method of ["post", "put", "patch", "delete", "options", "head", "get", "trace"])
    full.paths["/full"][method] = { operationId: method };
  assert.throws(() => transformer(full), /No free Zod generation method/);
});

test("offline Orval generation retains QUERY body, path, query and header schemas together", async () => {
  const directory = mkdtempSync(resolve(root, "tests/.query-zod-"));
  try {
    const target = resolve(directory, "schemas.ts");
    await generate(
      {
        input: {
          target: {
            openapi: "3.2.1",
            info: { title: "Offline QUERY regression", version: "1" },
            paths: {
              "/test/{id}": {
                parameters: [
                  {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string", minLength: 1 },
                  },
                ],
                post: {
                  operationId: "real-post",
                  requestBody: {
                    required: true,
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          additionalProperties: false,
                          required: ["enabled"],
                          properties: { enabled: { type: "boolean" } },
                        },
                      },
                    },
                  },
                  responses: { 200: { description: "OK" } },
                },
                query: {
                  operationId: "test-query",
                  parameters: [
                    {
                      in: "query",
                      name: "limit",
                      required: true,
                      schema: { type: "integer", minimum: 1, maximum: 5 },
                    },
                    {
                      in: "header",
                      name: "X-Test",
                      required: true,
                      schema: { type: "string", minLength: 1 },
                    },
                  ],
                  requestBody: {
                    required: true,
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          additionalProperties: false,
                          required: ["token"],
                          properties: { token: { type: "string", minLength: 1 } },
                        },
                      },
                    },
                  },
                  responses: { 200: { description: "OK" } },
                },
              },
            },
          },
          override: { transformer },
        },
        output: {
          target,
          client: "zod",
          schemas: false,
          clean: false,
          indexFiles: false,
          override: {
            zod: { ...config.billing_v1_zod.output.override.zod, generateReusableSchemas: false },
          },
        },
      },
      root,
    );
    const javascript = ts.transpileModule(readFileSync(target, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const executable = resolve(directory, "schemas.js");
    writeFileSync(executable, javascript);
    const schemas = await import(pathToFileURL(executable));
    assert.deepEqual(schemas.TestQueryBody.parse({ token: "test-only" }), { token: "test-only" });
    assert.equal(schemas.TestQueryBody.safeParse({ enabled: true }).success, false);
    assert.equal(
      schemas.TestQueryBody.safeParse({ token: "test-only", extra: true }).success,
      false,
    );
    assert.deepEqual(schemas.TestQueryParams.parse({ id: "query-test" }), { id: "query-test" });
    assert.equal(schemas.TestQueryParams.safeParse({ id: "" }).success, false);
    assert.deepEqual(schemas.TestQueryQueryParams.parse({ limit: 5 }), { limit: 5 });
    assert.equal(schemas.TestQueryQueryParams.safeParse({ limit: 6 }).success, false);
    assert.equal(schemas.TestQueryQueryParams.safeParse({ limit: "5" }).success, false);
    assert.deepEqual(schemas.TestQueryHeader.parse({ "X-Test": "test-only" }), {
      "X-Test": "test-only",
    });
    assert.equal(schemas.TestQueryHeader.safeParse({}).success, false);
    assert.deepEqual(schemas.RealPostBody.parse({ enabled: true }), { enabled: true });
    assert.equal(schemas.RealPostBody.safeParse({ token: "test-only" }).success, false);
  } finally {
    // 只清理本测试独占创建的临时生成目录，不触碰任何现有输出。
    rmSync(directory, { recursive: true, force: true });
  }
});

let queryCount = 0;
for (const [project, entry] of Object.entries(config)) {
  if (!project.endsWith("_fetch")) continue;
  const file = resolve(root, entry.input.target);
  const spec = document(file);
  if (!Object.keys(spec.paths ?? {}).length) continue;
  const module = project.slice(0, -6).replaceAll("_", "/");
  const code = readFileSync(resolve(root, `src/${module}/generated/functions.ts`), "utf8");
  const syntax = ts.createSourceFile("functions.ts", code, ts.ScriptTarget.ESNext, true);
  test(`${module}: every non-stream fetch uses the unified decoder`, () => {
    assert.doesNotMatch(code, /JSON\.parse\(/);
    for (const statement of syntax.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      const declaration = statement.declarationList.declarations[0];
      const block = declaration.initializer?.body;
      if (!block || !ts.isBlock(block)) continue;
      if (
        block.statements.some(
          (item) =>
            ts.isVariableStatement(item) &&
            item.declarationList.declarations[0].name.getText(syntax) === "res",
        )
      )
        assert.match(
          block.getText(syntax),
          /await decodeResponse\(/,
          declaration.name.getText(syntax),
        );
    }
  });

  for (const [path, pathReference] of Object.entries(spec.paths ?? {})) {
    const item = dereference(pathReference, file);
    if (!item.value.query) continue;
    queryCount++;
    const operation = item.value.query;
    const name = pascal(operation.operationId);
    test(`${module} ${operation.operationId}: complete QUERY schemas and genuine HTTP method`, async () => {
      const schemas = await import(
        pathToFileURL(resolve(root, `dist/${module}/generated/schemas.zod.js`))
      );
      const functions = await import(
        pathToFileURL(resolve(root, `dist/${module}/generated/functions.js`))
      );
      if (operation.requestBody) {
        const body = dereference(operation.requestBody, item.file);
        const validator = schemas[`${name}Body`];
        assert.ok(validator, `${name}Body must be generated`);
        if (body.value.required) assert.equal(validator.safeParse(undefined).success, false);
        const input = dereference(body.value.content["application/json"].schema, body.file).value;
        if (input.additionalProperties === false)
          assert.equal(validator.safeParse({ __unexpected_query_field: true }).success, false);
        if (validator.shape) {
          assert.deepEqual(
            Object.keys(validator.shape).sort(),
            Object.keys(input.properties ?? {}).sort(),
          );
          for (const field of input.required ?? [])
            assert.equal(
              validator.shape[field].isOptional(),
              false,
              `${name}Body.${field} is required`,
            );
        }
      }
      const groups = { path: "Params", query: "QueryParams", header: "Header" };
      const parameters = [...(item.value.parameters ?? []), ...(operation.parameters ?? [])].map(
        (value) => dereference(value, item.file).value,
      );
      for (const [location, suffix] of Object.entries(groups)) {
        const fields = parameters.filter((parameter) => parameter.in === location);
        if (!fields.length) continue;
        const validator = schemas[`${name}${suffix}`];
        assert.ok(validator, `${name}${suffix} must retain QUERY operation parameters`);
        for (const field of fields) {
          assert.ok(validator.shape[field.name], `missing ${location} parameter ${field.name}`);
          assert.equal(validator.shape[field.name].isOptional(), !field.required);
        }
        assert.equal(validator.safeParse({ __unexpected_query_parameter: true }).success, false);
      }
      const route = routes.find(
        (route) =>
          route.contract === module.replace(/\/v\d+$/, "") &&
          route.path === path &&
          route.operationId === operation.operationId,
      );
      assert.ok(route);
      assert.equal(route.method, "QUERY");
      const functionName = name[0].toLowerCase() + name.slice(1);
      const statement = syntax.statements.find(
        (statement) =>
          ts.isVariableStatement(statement) &&
          statement.declarationList.declarations[0].name.getText(syntax) === functionName,
      );
      assert.ok(statement);
      const fetchFn = async (url, init) => {
        assert.equal(init.method, "QUERY");
        assert.equal(
          new URL(String(url), "https://offline.invalid").pathname,
          path.replace(/\{[^}]+\}/g, "query-test"),
        );
        return Response.json({});
      };
      const args = statement.declarationList.declarations[0].initializer.parameters.map(
        (parameter) => {
          const key = parameter.name.getText(syntax);
          if (key === "fetchFn") return fetchFn;
          if (key === "options") return undefined;
          if (parameter.type.kind === ts.SyntaxKind.StringKeyword) return "query-test";
          if (parameter.type.kind === ts.SyntaxKind.NumberKeyword) return 42;
          return {};
        },
      );
      assert.equal((await functions[functionName](...args)).status, 200);
    });
  }
}
test("every routed QUERY is covered by the local-contract schema checks", () => {
  assert.ok(queryCount > 0);
  assert.equal(queryCount, routes.filter((route) => route.method === "QUERY").length);
});
