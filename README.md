# Leaflow TypeScript SDK

Native Orval fetch functions, models and request-only Zod schemas live together under
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

`orval.config.mjs` is plain official Orval configuration with a fixed module map. No custom generator,
output postprocessing or compatibility forwarding layer is used. For local generation, CONTRACTS_DIR
may point to an existing clean checkout of the exact CONTRACTS_REF commit. CI checks out that commit.
