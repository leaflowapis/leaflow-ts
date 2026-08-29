// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /api/v1/notifications` 成功时的响应体。 */
export type ListNotificationsResult =
  operations["list-notifications"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/notifications` 的查询参数。 */
export type ListNotificationsQuery =
  operations["list-notifications"]["parameters"]["query"];

/** `POST /api/v1/notifications/read` 成功时的响应体。 */
export type MarkNotificationsReadResult =
  operations["mark-notifications-read"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/notifications/read` 的请求体。 */
export type MarkNotificationsReadBody = NonNullable<
  operations["mark-notifications-read"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/notifications/unread-count` 成功时的响应体。 */
export type CountUnreadNotificationsResult =
  operations["count-unread-notifications"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/notifications/unread-count` 的查询参数。 */
export type CountUnreadNotificationsQuery =
  operations["count-unread-notifications"]["parameters"]["query"];

/** `GET /api/v1/notifications/{notificationId}` 成功时的响应体。 */
export type GetNotificationResult =
  operations["get-notification"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/notifications/{notificationId}/read` 成功时的响应体。 */
export type MarkNotificationReadResult =
  operations["mark-notification-read"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/notifications/{notificationId}/archive` 成功时的响应体。 */
export type ArchiveNotificationResult =
  operations["archive-notification"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/announcements` 成功时的响应体。 */
export type ListAnnouncementsResult =
  operations["list-announcements"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/announcements/read` 成功时的响应体。 */
export type ReadAllAnnouncementsResult =
  operations["read-all-announcements"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/notification-types` 成功时的响应体。 */
export type ListNotificationTypesResult =
  operations["list-notification-types"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/preferences` 成功时的响应体。 */
export type GetNotificationPreferencesResult =
  operations["get-notification-preferences"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/preferences` 成功时的响应体。 */
export type UpdateNotificationPreferencesResult =
  operations["update-notification-preferences"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/preferences` 的请求体。 */
export type UpdateNotificationPreferencesBody = NonNullable<
  operations["update-notification-preferences"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/preferences/types` 成功时的响应体。 */
export type ListTypePreferencesResult =
  operations["list-type-preferences"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/preferences/types` 的查询参数。 */
export type ListTypePreferencesQuery =
  operations["list-type-preferences"]["parameters"]["query"];

/** `PUT /api/v1/preferences/types/{type}` 成功时的响应体。 */
export type UpdateTypePreferenceResult =
  operations["update-type-preference"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/preferences/types/{type}` 的请求体。 */
export type UpdateTypePreferenceBody = NonNullable<
  operations["update-type-preference"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/channels` 成功时的响应体。 */
export type ListUserChannelsResult =
  operations["list-user-channels"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/channels` 的查询参数。 */
export type ListUserChannelsQuery =
  operations["list-user-channels"]["parameters"]["query"];

/** `POST /api/v1/channels` 成功时的响应体。 */
export type CreateUserChannelResult =
  operations["create-user-channel"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/channels` 的请求体。 */
export type CreateUserChannelBody = NonNullable<
  operations["create-user-channel"]["requestBody"]
>["content"]["application/json"];

/** `PATCH /api/v1/channels/{channelId}` 成功时的响应体。 */
export type UpdateUserChannelResult =
  operations["update-user-channel"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/channels/{channelId}` 的请求体。 */
export type UpdateUserChannelBody = NonNullable<
  operations["update-user-channel"]["requestBody"]
>["content"]["application/json"];

/** `POST /api/v1/channels/{channelId}/verify` 成功时的响应体。 */
export type VerifyUserChannelResult =
  operations["verify-user-channel"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/credentials/{ticketId}` 成功时的响应体。 */
export type DescribeCredentialTicketResult =
  operations["describe-credential-ticket"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/credentials/{ticketId}/reveal` 成功时的响应体。 */
export type RevealCredentialResult =
  operations["reveal-credential"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/realtime` 成功时的响应体。 */
export type DescribeRealtimeConnectionResult =
  operations["describe-realtime-connection"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/realtime/auth` 成功时的响应体。 */
export type AuthorizeRealtimeChannelResult =
  operations["authorize-realtime-channel"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/realtime/auth` 的请求体。 */
export type AuthorizeRealtimeChannelBody = NonNullable<
  operations["authorize-realtime-channel"]["requestBody"]
>["content"]["application/json"];
