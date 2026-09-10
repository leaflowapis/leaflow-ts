// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /api/v1/regions` 成功时的响应体。 */
export type ListRegionsResult =
  operations["list-regions"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/regions/{regionCode}/availability-zones` 成功时的响应体。 */
export type ListAvailabilityZonesResult =
  operations["list-availability-zones"]["responses"][200]["content"]["application/json"];
