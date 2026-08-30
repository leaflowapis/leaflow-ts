// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /account/v1/billing-accounts` 成功时的响应体。 */
export type ListBillingAccountsResult =
  operations["list-billing-accounts"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts` 成功时的响应体。 */
export type CreateBillingAccountResult =
  operations["create-billing-account"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts` 的请求体。 */
export type CreateBillingAccountBody = NonNullable<
  operations["create-billing-account"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}` 成功时的响应体。 */
export type GetBillingAccountResult =
  operations["get-billing-account"]["responses"][200]["content"]["application/json"];

/** `PUT /account/v1/billing-accounts/{accountKey}` 成功时的响应体。 */
export type UpdateBillingAccountResult =
  operations["update-billing-account"]["responses"][200]["content"]["application/json"];

/** `PUT /account/v1/billing-accounts/{accountKey}` 的请求体。 */
export type UpdateBillingAccountBody = NonNullable<
  operations["update-billing-account"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/credit-transactions` 成功时的响应体。 */
export type ListCreditTransactionsResult =
  operations["list-credit-transactions"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/balance` 成功时的响应体。 */
export type ReadBillingAccountBalanceResult =
  operations["read-billing-account-balance"]["responses"][200]["content"]["application/json"];

/** `PUT /account/v1/billing-accounts/{accountKey}/projects/{projectId}` 成功时的响应体。 */
export type BindProjectToBillingAccountResult =
  operations["bind-project-to-billing-account"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/orders` 成功时的响应体。 */
export type ListOrdersResult =
  operations["list-orders"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/orders/{orderId}` 成功时的响应体。 */
export type GetOrderResult =
  operations["get-order"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/top-ups` 成功时的响应体。 */
export type ListTopUpsResult =
  operations["list-top-ups"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/top-ups` 成功时的响应体。 */
export type StartTopUpResult =
  operations["start-top-up"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/top-ups` 的请求体。 */
export type StartTopUpBody = NonNullable<
  operations["start-top-up"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/charges` 成功时的响应体。 */
export type ListChargesResult =
  operations["list-charges"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/charges` 的查询参数。 */
export type ListChargesQuery =
  operations["list-charges"]["parameters"]["query"];

/** `GET /account/v1/billing-accounts/{accountKey}/charges/{chargeId}/usage` 成功时的响应体。 */
export type GetChargeUsageResult =
  operations["get-charge-usage"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/invoices` 成功时的响应体。 */
export type ListInvoicesResult =
  operations["list-invoices"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/invoices/{invoiceId}` 成功时的响应体。 */
export type GetInvoiceResult =
  operations["get-invoice"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/projects/{projectId}/billing-account` 成功时的响应体。 */
export type ReadProjectBillingAccountResult =
  operations["read-project-billing-account"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/projects/{projectId}/quote` 成功时的响应体。 */
export type QuoteProjectUsageResult =
  operations["quote-project-usage"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/projects/{projectId}/quote` 的请求体。 */
export type QuoteProjectUsageBody = NonNullable<
  operations["quote-project-usage"]["requestBody"]
>["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/quote` 成功时的响应体。 */
export type QuoteUsageResult =
  operations["quote-usage"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/quote` 的请求体。 */
export type QuoteUsageBody = NonNullable<
  operations["quote-usage"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/subscription` 成功时的响应体。 */
export type ReadSubscriptionResult =
  operations["read-subscription"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/subscription/cancel` 成功时的响应体。 */
export type CancelSubscriptionResult =
  operations["cancel-subscription"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/subscription/cancel` 的查询参数。 */
export type CancelSubscriptionQuery =
  operations["cancel-subscription"]["parameters"]["query"];

/** `GET /account/v1/billing-accounts/{accountKey}/top-ups/{paymentId}` 成功时的响应体。 */
export type ReadTopUpResult =
  operations["read-top-up"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/payment-method` 成功时的响应体。 */
export type ReadPaymentMethodResult =
  operations["read-payment-method"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/payment-method` 成功时的响应体。 */
export type StartPaymentMethodSetupResult =
  operations["start-payment-method-setup"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/billing-portal` 成功时的响应体。 */
export type StartBillingPortalResult =
  operations["start-billing-portal"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/offers` 成功时的响应体。 */
export type ListOffersResult =
  operations["list-offers"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/offers/{offerKey}/purchase` 成功时的响应体。 */
export type PurchaseOfferResult =
  operations["purchase-offer"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/offers/{offerKey}/purchase` 的查询参数。 */
export type PurchaseOfferQuery =
  operations["purchase-offer"]["parameters"]["query"];

/** `GET /account/v1/billing-accounts/{accountKey}/prepaid-assets` 成功时的响应体。 */
export type ListPrepaidAssetsResult =
  operations["list-prepaid-assets"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/prepaid-assets/{provisionId}/renewal-quote` 成功时的响应体。 */
export type QuoteRenewalResult =
  operations["quote-renewal"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountKey}/prepaid-assets/{provisionId}/renewal-quote` 的查询参数。 */
export type QuoteRenewalQuery =
  operations["quote-renewal"]["parameters"]["query"];

/** `POST /account/v1/billing-accounts/{accountKey}/prepaid-assets/{provisionId}/renew` 成功时的响应体。 */
export type RenewPrepaidAssetResult =
  operations["renew-prepaid-asset"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts/{accountKey}/prepaid-assets/{provisionId}/renew` 的请求体。 */
export type RenewPrepaidAssetBody = NonNullable<
  operations["renew-prepaid-asset"]["requestBody"]
>["content"]["application/json"];
