// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /api/v1/tunnel/l4` 成功时的响应体。 */
export type GetL4TunnelResult =
  operations["get-l4-tunnel"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/tunnel/l4` 成功时的响应体。 */
export type GenerateL4TunnelResult =
  operations["generate-l4-tunnel"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tunnel/l4/subscription` 成功时的响应体。 */
export type GetL4TunnelSubscriptionResult =
  operations["get-l4-tunnel-subscription"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/tunnel/l4/subscription/rotate` 成功时的响应体。 */
export type RotateL4TunnelSubscriptionResult =
  operations["rotate-l4-tunnel-subscription"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tunnel/l4/usage` 成功时的响应体。 */
export type GetL4TunnelUsageResult =
  operations["get-l4-tunnel-usage"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tunnel/l4/usage/series` 成功时的响应体。 */
export type ListL4TunnelUsageSeriesResult =
  operations["list-l4-tunnel-usage-series"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tunnel/l4/usage/series` 的查询参数。 */
export type ListL4TunnelUsageSeriesQuery =
  operations["list-l4-tunnel-usage-series"]["parameters"]["query"];
