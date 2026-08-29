// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /api/v1/notices` 成功时的响应体。 */
export type ListNoticesResult =
  operations["list-notices"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tickets` 成功时的响应体。 */
export type ListTicketsResult =
  operations["list-tickets"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tickets` 的查询参数。 */
export type ListTicketsQuery =
  operations["list-tickets"]["parameters"]["query"];

/** `POST /api/v1/tickets` 成功时的响应体。 */
export type CreateTicketResult =
  operations["create-ticket"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/tickets` 的请求体。 */
export type CreateTicketBody = NonNullable<
  operations["create-ticket"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/tickets/{ticketId}` 成功时的响应体。 */
export type GetTicketResult =
  operations["get-ticket"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/tickets/{ticketId}/close` 成功时的响应体。 */
export type CloseTicketResult =
  operations["close-ticket"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tickets/{ticketId}/messages` 成功时的响应体。 */
export type ListTicketMessagesResult =
  operations["list-ticket-messages"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/tickets/{ticketId}/messages` 的查询参数。 */
export type ListTicketMessagesQuery =
  operations["list-ticket-messages"]["parameters"]["query"];

/** `POST /api/v1/tickets/{ticketId}/messages` 成功时的响应体。 */
export type CreateTicketMessageResult =
  operations["create-ticket-message"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/tickets/{ticketId}/messages` 的请求体。 */
export type CreateTicketMessageBody = NonNullable<
  operations["create-ticket-message"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/tickets/{ticketId}/satisfaction` 成功时的响应体。 */
export type GetTicketSatisfactionResult =
  operations["get-ticket-satisfaction"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/tickets/{ticketId}/satisfaction` 成功时的响应体。 */
export type CreateTicketSatisfactionResult =
  operations["create-ticket-satisfaction"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/tickets/{ticketId}/satisfaction` 的请求体。 */
export type CreateTicketSatisfactionBody = NonNullable<
  operations["create-ticket-satisfaction"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/ticket-categories` 成功时的响应体。 */
export type ListTicketCategoriesResult =
  operations["list-ticket-categories"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/ticket-categories` 的查询参数。 */
export type ListTicketCategoriesQuery =
  operations["list-ticket-categories"]["parameters"]["query"];

/** `POST /api/v1/attachments` 成功时的响应体。 */
export type UploadAttachmentResult =
  operations["upload-attachment"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/attachments` 的查询参数。 */
export type UploadAttachmentQuery =
  operations["upload-attachment"]["parameters"]["query"];

/** `GET /api/v1/attachments/{attachmentId}/content` 的查询参数。 */
export type DownloadAttachmentQuery =
  operations["download-attachment"]["parameters"]["query"];

/** `GET /api/v1/maintenances` 成功时的响应体。 */
export type ListMaintenancesResult =
  operations["list-maintenances"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/maintenances` 的查询参数。 */
export type ListMaintenancesQuery =
  operations["list-maintenances"]["parameters"]["query"];

/** `GET /api/v1/maintenances/{maintenanceId}` 成功时的响应体。 */
export type GetMaintenanceResult =
  operations["get-maintenance"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/maintenances/{maintenanceId}/timeline` 成功时的响应体。 */
export type ListMaintenanceTimelineResult =
  operations["list-maintenance-timeline"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/maintenances/{maintenanceId}/timeline` 的查询参数。 */
export type ListMaintenanceTimelineQuery =
  operations["list-maintenance-timeline"]["parameters"]["query"];
