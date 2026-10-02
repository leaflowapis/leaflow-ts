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
Zod generation is limited to request validation. Normal response models and native fetch return types
remain available; responses are not automatically parsed or restricted by request validators.

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

`CONTRACTS_REF` pins published contract commit `7d63a7ba860cd66d6dcf630142b2e7943080b633`. Existing CI injects
snapshot or tag package versions; the working-tree package version remains `0.0.0`. Run generation
from the remote source, or supply a clean checkout of that exact published commit with `CONTRACTS_DIR`.

Fixed financial request objects reject undeclared fields. Quote lines, refund lines and dimension
settings are closed; price and rate-rule tier inputs are closed independently of shared response tiers.
Explicit dictionary fields such as `labels` and `dimensions` keep their permitted business keys.
Caller-supplied zero, false, null and decimal strings retain their meanings; declared defaults may
be added by the generated schema. Request amount limits are distinct from response and quantity limits.

The native source-backed financial request matrix and both built SDKs pass 113 request cases, including
misspelled fields and invalid amounts rejected before fetch. Fixed-source regeneration, NodeNext
compilation and package-entry checks are recorded in the validation evidence. Earlier generic tool
limitations remain historical evidence; these checks do not establish every frontend call site or
authenticated business acceptance.

The native Zod target does not emit a request body schema for the octet-stream Blob upload.
Source contracts also do not encode every BillingChoice business condition. These are explicit
coverage limits, not proof of complete request validation. Frontend/BFF call-site wiring, authentication
and authenticated business acceptance remain with their owners.
