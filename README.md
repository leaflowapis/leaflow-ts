# Leaflow TypeScript SDK

`@leaflow/sdk` is generated from public OpenAPI 3.2.1 contracts with official Orval 8.39.0 fetch and
Zod 4 outputs. This is a breaking migration: the old openapi-fetch client factory, paths/components
maps and mechanically created Result/Body/Query compatibility aliases are removed.

```ts
import { compute } from "@leaflow/sdk";
const body = compute.schemas.SetInstanceLabelsBody.parse({ labels: { env: "prod" } });
const result = await compute.setInstanceLabels(
  instanceId,
  body,
  {
    headers: { Authorization: `Bearer ${scopedToken}` },
    signal,
  },
  projectTransportFetch,
);
if (result.status === 200) console.log(result.data);
```

`projectTransportFetch` is the caller's standard fetch-compatible function. Every native operation
accepts a final optional `fetchFn`, and a normal `RequestInit` supplies headers, credentials and signal.
There is no SDK token store, global client/service registry, connect wrapper or per-user singleton.
Public URLs use each contract's own servers[0]; an injected fetch can apply the BFF's service prefix
once. URL helper functions (`getGetInstanceUrl`, `getListInstancesUrl`, …) are native Orval exports.

Request schemas are exported under each module's `schemas` namespace, and types/models plus native
operation functions are exported directly. Examples: `compute.SetInstanceLabelsRequestBody`,
`compute.schemas.GetInstanceParams`, `compute.schemas.ListInstancesQueryParams` and
`compute.schemas.SetInstanceLabelsBody`. Root service namespaces and versioned subpath imports
are both available; Billing retains `billing.account`, `billing.catalog` and `billing.project`.

**Parsing is caller wiring, not an automatic SDK pre-send guarantee.** Call `.parse` on generated
body/query/path/declared-header schemas before invoking the native operation. Authorization is not a
contract header schema; keep token handling in the existing transport. No global coercion is enabled.
The SDK does not automatically parse responses. Exported response schemas are available for a caller
that explicitly chooses response validation.

## Generation and release

```sh
npm ci
CONTRACTS_DIR=/absolute/pinned/contracts npm run generate
npm run typecheck
npm run build
```

All DTOs, functions and Zod schemas are Orval output. `scripts/generate.mjs` only discovers inputs,
invokes the official tool, builds normal package barrels and records routing/authentication facts.
`output.tsconfig` uses the actual NodeNext configuration; `indexFiles:false` makes native imports
explicit `.js` files rather than invalid directory imports. No generated imports are rewritten. Official `urlEncodeParameters:true` protects native path helpers
for string keys containing `/`, `#`, spaces or `%`; no URL helper is hand-edited.

`CONTRACTS_REF` currently names a **local unpublished contract candidate**. The local generation is
an exercise; after review the parent must first publish contracts, set the published remote SHA and
regenerate using the default remote path. Package version stays `0.0.0`; existing CI injects snapshot
or tag versions. This candidate is not a published SDK release.

See `evidence/orval/READINESS.md` for the fixed final contract SHA, package checksums, checks and
native signatures. Generic pre-send fixture failures and earlier 59/0e results remain separate evidence.
The actual 314 closed-object components, disjoint BootDisk, corrected int32 bounds and final checkout
zero-HTTP rejections are checked; this does not establish every full request or frontend call site.

**Release gate: native open-object semantics remain unresolved.** Seven known-property request
components allow extensions because additionalProperties is omitted. Native global strict rejects
those legal extensions. Independent copies using `additionalProperties:true` or `{}` behave the same;
no product contract was narrowed. Exact refs and affected operations are in
`evidence/orval/open-unspecified-review.json` and the public candidate's
`fixtures/orval-open-properties/`. Final financial source also adds four object constraint branches;
actual full coupon requests pass native Zod intersection tests, so a branch inventory alone is not a
composition failure. Einstein owns further native-configuration/source-equivalence review.

The native Zod target does not emit a request body schema for the octet-stream Blob upload.
Source contracts also do not encode every BillingChoice business condition. These are explicit
coverage limits, not proof of complete request validation. Frontend/BFF call-site wiring, authentication
and release approval remain with their owners. Do not publish this candidate before the open-object
release gate is resolved.
