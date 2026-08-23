// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /api/v1/incidents` 成功时的响应体。 */
export type ListIncidentsResult =
  operations["list-incidents"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/incidents` 的查询参数。 */
export type ListIncidentsQuery =
  operations["list-incidents"]["parameters"]["query"];

/** `GET /api/v1/incidents/{incidentId}` 成功时的响应体。 */
export type GetIncidentResult =
  operations["get-incident"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/acknowledge` 成功时的响应体。 */
export type AcknowledgeIncidentResult =
  operations["acknowledge-incident"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/acknowledge` 的请求体。 */
export type AcknowledgeIncidentBody = NonNullable<
  operations["acknowledge-incident"]["requestBody"]
>["content"]["application/json"];

/** `PUT /api/v1/incidents/{incidentId}/assignee` 成功时的响应体。 */
export type AssignIncidentResult =
  operations["assign-incident"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/incidents/{incidentId}/assignee` 的请求体。 */
export type AssignIncidentBody = NonNullable<
  operations["assign-incident"]["requestBody"]
>["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/close` 成功时的响应体。 */
export type CloseIncidentResult =
  operations["close-incident"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/close` 的请求体。 */
export type CloseIncidentBody = NonNullable<
  operations["close-incident"]["requestBody"]
>["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/comments` 成功时的响应体。 */
export type AddIncidentCommentResult =
  operations["add-incident-comment"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/comments` 的请求体。 */
export type AddIncidentCommentBody = NonNullable<
  operations["add-incident-comment"]["requestBody"]
>["content"]["application/json"];

/** `PUT /api/v1/incidents/{incidentId}/following` 成功时的响应体。 */
export type SetIncidentFollowingResult =
  operations["set-incident-following"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/incidents/{incidentId}/following` 的请求体。 */
export type SetIncidentFollowingBody = NonNullable<
  operations["set-incident-following"]["requestBody"]
>["content"]["application/json"];

/** `POST /api/v1/incidents/{incidentId}/reopen` 成功时的响应体。 */
export type ReopenIncidentResult =
  operations["reopen-incident"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/incidents/{incidentId}/timeline` 成功时的响应体。 */
export type ListIncidentTimelineResult =
  operations["list-incident-timeline"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/incidents/{incidentId}/timeline` 的查询参数。 */
export type ListIncidentTimelineQuery =
  operations["list-incident-timeline"]["parameters"]["query"];

/** `GET /api/v1/maintenance-windows` 成功时的响应体。 */
export type ListMaintenanceWindowsResult =
  operations["list-maintenance-windows"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/maintenance-windows/{windowId}` 成功时的响应体。 */
export type GetMaintenanceWindowResult =
  operations["get-maintenance-window"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/maintenance-windows/{windowId}` 成功时的响应体。 */
export type PutMaintenanceWindowResult =
  operations["put-maintenance-window"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/maintenance-windows/{windowId}` 的请求体。 */
export type PutMaintenanceWindowBody = NonNullable<
  operations["put-maintenance-window"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/overview` 成功时的响应体。 */
export type GetProjectOverviewResult =
  operations["get-project-overview"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/servers/{serverId}/items` 成功时的响应体。 */
export type ListServerItemsResult =
  operations["list-server-items"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/servers/{serverId}/items` 的查询参数。 */
export type ListServerItemsQuery =
  operations["list-server-items"]["parameters"]["query"];

/** `GET /api/v1/servers/{serverId}/metrics` 成功时的响应体。 */
export type GetServerMetricResult =
  operations["get-server-metric"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/servers/{serverId}/metrics` 的查询参数。 */
export type GetServerMetricQuery =
  operations["get-server-metric"]["parameters"]["query"];

/** `GET /api/v1/servers/{serverId}/resources` 成功时的响应体。 */
export type GetServerResourcesResult =
  operations["get-server-resources"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/servers/{serverId}/snapshot` 成功时的响应体。 */
export type GetServerSnapshotResult =
  operations["get-server-snapshot"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/top-items` 成功时的响应体。 */
export type ListProjectTopItemsResult =
  operations["list-project-top-items"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/top-items` 的查询参数。 */
export type ListProjectTopItemsQuery =
  operations["list-project-top-items"]["parameters"]["query"];

/** `GET /api/v1/servers` 成功时的响应体。 */
export type ListServersResult =
  operations["list-servers"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/servers` 的查询参数。 */
export type ListServersQuery =
  operations["list-servers"]["parameters"]["query"];

/** `GET /api/v1/servers/{serverId}` 成功时的响应体。 */
export type GetServerResult =
  operations["get-server"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/servers/{serverId}` 成功时的响应体。 */
export type UpdateServerResult =
  operations["update-server"]["responses"][200]["content"]["application/json"];

/** `PATCH /api/v1/servers/{serverId}` 的请求体。 */
export type UpdateServerBody = NonNullable<
  operations["update-server"]["requestBody"]
>["content"]["application/json"];

/** `PUT /api/v1/servers/{serverId}` 成功时的响应体。 */
export type EnableServerMonitoringResult =
  operations["enable-server-monitoring"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/servers/{serverId}` 的请求体。 */
export type EnableServerMonitoringBody = NonNullable<
  operations["enable-server-monitoring"]["requestBody"]
>["content"]["application/json"];

/** `POST /api/v1/servers/{serverId}/psk` 成功时的响应体。 */
export type RotateAgentPskResult =
  operations["rotate-agent-psk"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/servers/{serverId}/web-checks/{checkId}` 成功时的响应体。 */
export type GetWebCheckResult =
  operations["get-web-check"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/servers/{serverId}/web-checks/{checkId}` 成功时的响应体。 */
export type PutWebCheckResult =
  operations["put-web-check"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/servers/{serverId}/web-checks/{checkId}` 的请求体。 */
export type PutWebCheckBody = NonNullable<
  operations["put-web-check"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/web-checks` 成功时的响应体。 */
export type ListWebChecksResult =
  operations["list-web-checks"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/web-checks` 的查询参数。 */
export type ListWebChecksQuery =
  operations["list-web-checks"]["parameters"]["query"];

/** `GET /api/v1/sli-report` 成功时的响应体。 */
export type GetSliReportResult =
  operations["get-sli-report"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/sli-report` 的查询参数。 */
export type GetSliReportQuery =
  operations["get-sli-report"]["parameters"]["query"];

/** `GET /api/v1/slo` 成功时的响应体。 */
export type GetSloResult =
  operations["get-slo"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/slo` 成功时的响应体。 */
export type PutSloResult =
  operations["put-slo"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/slo` 的请求体。 */
export type PutSloBody = NonNullable<
  operations["put-slo"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page` 成功时的响应体。 */
export type GetStatusPageResult =
  operations["get-status-page"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page` 成功时的响应体。 */
export type PutStatusPageResult =
  operations["put-status-page"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page` 的请求体。 */
export type PutStatusPageBody = NonNullable<
  operations["put-status-page"]["requestBody"]
>["content"]["application/json"];

/** `PUT /api/v1/status-page/order` 的请求体。 */
export type PutStatusPageOrderBody = NonNullable<
  operations["put-status-page-order"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/groups` 成功时的响应体。 */
export type ListStatusPageGroupsResult =
  operations["list-status-page-groups"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/status-page/groups` 成功时的响应体。 */
export type CreateStatusPageGroupResult =
  operations["create-status-page-group"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/status-page/groups` 的请求体。 */
export type CreateStatusPageGroupBody = NonNullable<
  operations["create-status-page-group"]["requestBody"]
>["content"]["application/json"];

/** `PUT /api/v1/status-page/groups/{groupId}` 成功时的响应体。 */
export type UpdateStatusPageGroupResult =
  operations["update-status-page-group"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page/groups/{groupId}` 的请求体。 */
export type UpdateStatusPageGroupBody = NonNullable<
  operations["update-status-page-group"]["requestBody"]
>["content"]["application/json"];

/** `PUT /api/v1/status-page/groups/{groupId}/order` 的请求体。 */
export type PutStatusPageGroupOrderBody = NonNullable<
  operations["put-status-page-group-order"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/components` 成功时的响应体。 */
export type ListStatusPageComponentsResult =
  operations["list-status-page-components"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/status-page/components` 成功时的响应体。 */
export type CreateStatusPageComponentResult =
  operations["create-status-page-component"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/status-page/components` 的请求体。 */
export type CreateStatusPageComponentBody = NonNullable<
  operations["create-status-page-component"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/components/{componentId}` 成功时的响应体。 */
export type GetStatusPageComponentResult =
  operations["get-status-page-component"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page/components/{componentId}` 成功时的响应体。 */
export type UpdateStatusPageComponentResult =
  operations["update-status-page-component"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page/components/{componentId}` 的请求体。 */
export type UpdateStatusPageComponentBody = NonNullable<
  operations["update-status-page-component"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/components/{componentId}/sources` 成功时的响应体。 */
export type ListStatusPageComponentSourcesResult =
  operations["list-status-page-component-sources"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page/components/{componentId}/sources` 成功时的响应体。 */
export type PutStatusPageComponentSourcesResult =
  operations["put-status-page-component-sources"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/status-page/components/{componentId}/sources` 的请求体。 */
export type PutStatusPageComponentSourcesBody = NonNullable<
  operations["put-status-page-component-sources"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/incidents` 成功时的响应体。 */
export type ListStatusPageIncidentsResult =
  operations["list-status-page-incidents"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/status-page/incidents` 的查询参数。 */
export type ListStatusPageIncidentsQuery =
  operations["list-status-page-incidents"]["parameters"]["query"];

/** `POST /api/v1/status-page/incidents` 成功时的响应体。 */
export type PublishStatusPageIncidentResult =
  operations["publish-status-page-incident"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/status-page/incidents` 的请求体。 */
export type PublishStatusPageIncidentBody = NonNullable<
  operations["publish-status-page-incident"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/incidents/{incidentId}` 成功时的响应体。 */
export type GetStatusPageIncidentResult =
  operations["get-status-page-incident"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/status-page/incidents/{incidentId}/updates` 成功时的响应体。 */
export type PostStatusPageIncidentUpdateResult =
  operations["post-status-page-incident-update"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/status-page/incidents/{incidentId}/updates` 的请求体。 */
export type PostStatusPageIncidentUpdateBody = NonNullable<
  operations["post-status-page-incident-update"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/maintenances` 成功时的响应体。 */
export type ListStatusPageMaintenancesResult =
  operations["list-status-page-maintenances"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/status-page/maintenances` 的查询参数。 */
export type ListStatusPageMaintenancesQuery =
  operations["list-status-page-maintenances"]["parameters"]["query"];

/** `POST /api/v1/status-page/maintenances` 成功时的响应体。 */
export type ScheduleStatusPageMaintenanceResult =
  operations["schedule-status-page-maintenance"]["responses"][201]["content"]["application/json"];

/** `POST /api/v1/status-page/maintenances` 的请求体。 */
export type ScheduleStatusPageMaintenanceBody = NonNullable<
  operations["schedule-status-page-maintenance"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/status-page/maintenances/{maintenanceId}` 成功时的响应体。 */
export type GetStatusPageMaintenanceResult =
  operations["get-status-page-maintenance"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/status-page/maintenances/{maintenanceId}/cancel` 成功时的响应体。 */
export type CancelStatusPageMaintenanceResult =
  operations["cancel-status-page-maintenance"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/status-page/maintenances/{maintenanceId}/complete` 成功时的响应体。 */
export type CompleteStatusPageMaintenanceResult =
  operations["complete-status-page-maintenance"]["responses"][200]["content"]["application/json"];
