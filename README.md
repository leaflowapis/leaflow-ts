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
explicit `.js` files rather than invalid directory imports. No generated imports are rewritten.

`CONTRACTS_REF` currently names a **local unpublished contract candidate**. The local generation is
an exercise; after review the parent must first publish contracts, set the published remote SHA and
regenerate using the default remote path. Package version stays `0.0.0`; existing CI injects snapshot
or tag versions. This candidate is not a published SDK release.

See `evidence/orval/` for input manifests, checks, native signatures and schema limitations. The generic
pre-send fixture's four failures are retained. The actual 314 closed-object schemas, disjoint BootDisk
union and corrected int32 bounds are tested separately. Seven known-property request schemas omit
additionalProperties and need strict-policy review; this candidate must not be presented as a complete
universal JSON Schema validator. Frontend/BFF call sites and service authorization remain owned by
their respective agents and are not modified here.
