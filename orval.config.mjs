import { defineConfig } from "orval";

const contracts = process.env.CONTRACTS_DIR ?? "./leaflowapis";
const modules = [
  ["leaflow/account/v1/openapi.yaml", "account/v1"],
  ["leaflow/assistant/v1/openapi.yaml", "assistant/v1"],
  ["leaflow/billing/account/v1/openapi.yaml", "billing/account/v1"],
  ["leaflow/billing/catalog/v1/openapi.yaml", "billing/catalog/v1"],
  ["leaflow/billing/project/v1/openapi.yaml", "billing/project/v1"],
  ["leaflow/canopy/v1/openapi.yaml", "canopy/v1"],
  ["leaflow/compute/v1/openapi.yaml", "compute/v1"],
  ["leaflow/dns/v1/openapi.yaml", "dns/v1"],
  ["leaflow/iam/v1/openapi.yaml", "iam/v1"],
  ["leaflow/monitoring/v1/openapi.yaml", "monitoring/v1"],
  ["leaflow/notification/v1/openapi.yaml", "notification/v1"],
  ["leaflow/support/v1/openapi.yaml", "support/v1"],
  ["leaflow/tunnel/v1/openapi.yaml", "tunnel/v1"],
  ["leaflow/type/v1/checkout.yaml", "type/checkout/v1"],
  ["leaflow/type/v1/error.yaml", "type/error/v1"],
  ["leaflow/type/v1/identity.yaml", "type/identity/v1"],
  ["leaflow/type/v1/money.yaml", "type/money/v1"],
  ["leaflow/type/v1/order.yaml", "type/order/v1"],
  ["leaflow/type/v1/pagination.yaml", "type/pagination/v1"],
  ["leaflow/type/v1/quote.yaml", "type/quote/v1"],
  ["leaflow/type/v1/resource.yaml", "type/resource/v1"],
  ["leaflow/type/v1/security.yaml", "type/security/v1"],
];
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
    modules.flatMap(([spec, module]) => {
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
              schemas: `./src/${module}/generated/models`,
              clean: true,
              client: "fetch",
              headers: true,
              urlEncodeParameters: true,
              baseUrl: { getBaseUrlFromSpecification: true, index: 0 },
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
