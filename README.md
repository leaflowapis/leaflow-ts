# Leaflow TypeScript SDK

Native Orval fetch functions, a native models.ts and request-only Zod schemas live together under
`src/<service>/v1/generated`. Module entry points stay outside that generated directory.
Root namespaces, versioned subpath imports and each module's `schemas`
export are preserved. `src/routes.ts` retains the static routing and authentication facts.

Validate requests with generated schemas before invoking native operations. Responses retain their
native models and return types. Credentials remain in RequestInit and the existing fetch transport.

## Generate and build

```sh
npm ci
git clone https://github.com/leaflowapis/leaflowapis.git leaflowapis
git -C leaflowapis checkout --detach "$(cat CONTRACTS_REF)"
npm run generate
npm run build
```

`orval.config.mjs` is plain official Orval configuration that recursively discovers OpenAPI entry documents. The Canopy hook chooses JSON or Blob for the chat completion response according to Content-Type,
so JSON and SSE retain their respective response formats. No compatibility forwarding layer is used. For local generation, CONTRACTS_DIR
may point to an existing clean checkout of the exact CONTRACTS_REF commit. CI checks out that commit.

## Canopy migration

Project inference and management are exported from `canopy` and `@leaflow/sdk/canopy/v1`.
Replace `canopyInference` and `@leaflow/sdk/canopy/inference/v1` imports with the shared Canopy module.
The OpenAI-compatible `/v1` paths, management `/api/v1` paths and scoped-token authentication are unchanged.
