// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /api/v1/credentials` 成功时的响应体。 */
export type ListCredentialsResult =
  operations["list-credentials"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/credentials` 的查询参数。 */
export type ListCredentialsQuery =
  operations["list-credentials"]["parameters"]["query"];

/** `POST /api/v1/credentials` 成功时的响应体。 */
export type CreateCredentialResult =
  operations["create-credential"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/credentials` 的请求体。 */
export type CreateCredentialBody = NonNullable<
  operations["create-credential"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/credentials/{credentialId}` 成功时的响应体。 */
export type GetCredentialResult =
  operations["get-credential"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/credentials/{credentialId}` 成功时的响应体。 */
export type RenameCredentialResult =
  operations["rename-credential"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/credentials/{credentialId}` 的请求体。 */
export type RenameCredentialBody = NonNullable<
  operations["rename-credential"]["requestBody"]
>["content"]["application/json"];

/** `POST /api/v1/credentials/{credentialId}/verification` 成功时的响应体。 */
export type VerifyCredentialResult =
  operations["verify-credential"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/zones` 成功时的响应体。 */
export type ListZonesResult =
  operations["list-zones"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/zones` 的查询参数。 */
export type ListZonesQuery =
  operations["list-zones"]["parameters"]["query"];

/** `GET /api/v1/zones/{zone}/records` 成功时的响应体。 */
export type ListRecordsResult =
  operations["list-records"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/zones/{zone}/records` 的查询参数。 */
export type ListRecordsQuery =
  operations["list-records"]["parameters"]["query"];

/** `POST /api/v1/zones/{zone}/records` 成功时的响应体。 */
export type AppendRecordsResult =
  operations["append-records"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/zones/{zone}/records` 的查询参数。 */
export type AppendRecordsQuery =
  operations["append-records"]["parameters"]["query"];

/** `POST /api/v1/zones/{zone}/records` 的请求体。 */
export type AppendRecordsBody = NonNullable<
  operations["append-records"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/zones/{zone}/records/{name}/{type}` 成功时的响应体。 */
export type GetRecordSetResult =
  operations["get-record-set"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/zones/{zone}/records/{name}/{type}` 成功时的响应体。 */
export type SetRecordSetResult =
  operations["set-record-set"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/zones/{zone}/records/{name}/{type}` 的查询参数。 */
export type SetRecordSetQuery =
  operations["set-record-set"]["parameters"]["query"];

/** `PUT /api/v1/zones/{zone}/records/{name}/{type}` 的请求体。 */
export type SetRecordSetBody = NonNullable<
  operations["set-record-set"]["requestBody"]
>["content"]["application/json"];

/** `DELETE /api/v1/zones/{zone}/records/{name}/{type}` 的查询参数。 */
export type DeleteRecordSetQuery =
  operations["delete-record-set"]["parameters"]["query"];
