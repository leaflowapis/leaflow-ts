// 由 scripts/generate-ts.mjs 生成，不要手改。
//
// 别名把 operations[...] 那串下标换成一个名字。原始的 paths / components / operations 也
// 一并导出：paths 是给 openapi-fetch 的 createClient<paths>() 用的。

export type { paths, components, operations, webhooks } from "./schema.js";

import type { operations } from "./schema.js";

/** `GET /catalog/v1/products` 成功时的响应体。 */
export type ListCatalogProductsResult =
  operations["list-catalog-products"]["responses"][200]["content"]["application/json"];

/** `GET /catalog/v1/products/{productId}/plans` 成功时的响应体。 */
export type ListCatalogPlansResult =
  operations["list-catalog-plans"]["responses"][200]["content"]["application/json"];

/** `GET /catalog/v1/plans/{planId}/prices` 成功时的响应体。 */
export type ListCatalogPricesResult =
  operations["list-catalog-prices"]["responses"][200]["content"]["application/json"];

/** `GET /catalog/v1/plans/{planId}/prices` 的查询参数。 */
export type ListCatalogPricesQuery =
  operations["list-catalog-prices"]["parameters"]["query"];

/** `GET /catalog/v1/rate-cards/{rateCardId}/rules` 成功时的响应体。 */
export type ListCatalogRatesResult =
  operations["list-catalog-rates"]["responses"][200]["content"]["application/json"];

/** `GET /catalog/v1/rate-cards/{rateCardId}/rules` 的查询参数。 */
export type ListCatalogRatesQuery =
  operations["list-catalog-rates"]["parameters"]["query"];

/** `POST /catalog/v1/estimates` 成功时的响应体。 */
export type CreateEstimateResult =
  operations["create-estimate"]["responses"][200]["content"]["application/json"];

/** `POST /catalog/v1/estimates` 的请求体。 */
export type CreateEstimateBody = NonNullable<
  operations["create-estimate"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts` 成功时的响应体。 */
export type ListBillingAccountsResult =
  operations["list-billing-accounts"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/billing-accounts` 成功时的响应体。 */
export type CreateBillingAccountResult =
  operations["create-billing-account"]["responses"][201]["content"]["application/json"];

/** `POST /account/v1/billing-accounts` 的请求体。 */
export type CreateBillingAccountBody = NonNullable<
  operations["create-billing-account"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountId}` 成功时的响应体。 */
export type GetBillingAccountResult =
  operations["get-billing-account"]["responses"][200]["content"]["application/json"];

/** `PATCH /account/v1/billing-accounts/{accountId}` 成功时的响应体。 */
export type UpdateBillingAccountResult =
  operations["update-billing-account"]["responses"][200]["content"]["application/json"];

/** `PATCH /account/v1/billing-accounts/{accountId}` 的请求体。 */
export type UpdateBillingAccountBody = NonNullable<
  operations["update-billing-account"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/billing-accounts/{accountId}/balance` 成功时的响应体。 */
export type GetAccountBalanceResult =
  operations["get-account-balance"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/projects` 成功时的响应体。 */
export type ListPaidProjectsResult =
  operations["list-paid-projects"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/projects` 的查询参数。 */
export type ListPaidProjectsQuery =
  operations["list-paid-projects"]["parameters"]["query"];

/** `GET /account/v1/projects/{projectId}/billing-account` 成功时的响应体。 */
export type FindProjectPayerResult =
  operations["find-project-payer"]["responses"][200]["content"]["application/json"];

/** `PUT /account/v1/projects/{projectId}/billing-account` 成功时的响应体。 */
export type SetProjectPayerResult =
  operations["set-project-payer"]["responses"][200]["content"]["application/json"];

/** `PUT /account/v1/projects/{projectId}/billing-account` 的请求体。 */
export type SetProjectPayerBody = NonNullable<
  operations["set-project-payer"]["requestBody"]
>["content"]["application/json"];

/** `POST /account/v1/projects/{projectId}/billing-account/settle` 成功时的响应体。 */
export type SettleProjectUsageResult =
  operations["settle-project-usage"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/top-ups` 成功时的响应体。 */
export type ListTopUpsResult =
  operations["list-top-ups"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/top-ups` 成功时的响应体。 */
export type CreateTopUpResult =
  operations["create-top-up"]["responses"][201]["content"]["application/json"];

/** `POST /account/v1/top-ups` 的请求体。 */
export type CreateTopUpBody = NonNullable<
  operations["create-top-up"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/top-ups/{topUpId}` 成功时的响应体。 */
export type GetTopUpResult =
  operations["get-top-up"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/payment-methods` 成功时的响应体。 */
export type ListPaymentMethodsResult =
  operations["list-payment-methods"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/payment-methods/setup` 成功时的响应体。 */
export type CreatePaymentMethodSetupResult =
  operations["create-payment-method-setup"]["responses"][201]["content"]["application/json"];

/** `POST /account/v1/payment-methods/setup` 的请求体。 */
export type CreatePaymentMethodSetupBody = NonNullable<
  operations["create-payment-method-setup"]["requestBody"]
>["content"]["application/json"];

/** `PUT /account/v1/payment-methods/{paymentMethodId}/default` 成功时的响应体。 */
export type SetDefaultPaymentMethodResult =
  operations["set-default-payment-method"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/invoices/{invoiceId}/pay` 成功时的响应体。 */
export type PayInvoiceResult =
  operations["pay-invoice"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/invoices/{invoiceId}/pay` 的请求体。 */
export type PayInvoiceBody = NonNullable<
  operations["pay-invoice"]["requestBody"]
>["content"]["application/json"];

/** `POST /account/v1/orders/{orderId}/pay` 成功时的响应体。 */
export type PayOrderResult =
  operations["pay-order"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/orders/{orderId}/pay` 的请求体。 */
export type PayOrderBody = NonNullable<
  operations["pay-order"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/invoices` 成功时的响应体。 */
export type ListInvoicesResult =
  operations["list-invoices"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/invoices` 的查询参数。 */
export type ListInvoicesQuery =
  operations["list-invoices"]["parameters"]["query"];

/** `GET /account/v1/invoices/{invoiceId}` 成功时的响应体。 */
export type GetInvoiceResult =
  operations["get-invoice"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/invoices/{invoiceId}/items` 成功时的响应体。 */
export type ListInvoiceItemsResult =
  operations["list-invoice-items"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/transactions` 成功时的响应体。 */
export type ListTransactionsResult =
  operations["list-transactions"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/credit-grants` 成功时的响应体。 */
export type ListCreditGrantsResult =
  operations["list-credit-grants"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/credit-grants` 的查询参数。 */
export type ListCreditGrantsQuery =
  operations["list-credit-grants"]["parameters"]["query"];

/** `GET /account/v1/allocations` 成功时的响应体。 */
export type ListAllocationsResult =
  operations["list-allocations"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/allocations` 的查询参数。 */
export type ListAllocationsQuery =
  operations["list-allocations"]["parameters"]["query"];

/** `POST /account/v1/refunds` 成功时的响应体。 */
export type RequestRefundResult =
  operations["request-refund"]["responses"][201]["content"]["application/json"];

/** `POST /account/v1/refunds` 的请求体。 */
export type RequestRefundBody = NonNullable<
  operations["request-refund"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/refunds` 成功时的响应体。 */
export type ListRefundsResult =
  operations["list-refunds"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/usage-charges` 成功时的响应体。 */
export type ListUsageChargesResult =
  operations["list-usage-charges"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/usage-charges` 的查询参数。 */
export type ListUsageChargesQuery =
  operations["list-usage-charges"]["parameters"]["query"];

/** `GET /account/v1/subscriptions` 成功时的响应体。 */
export type ListSubscriptionsResult =
  operations["list-subscriptions"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/subscriptions` 的查询参数。 */
export type ListSubscriptionsQuery =
  operations["list-subscriptions"]["parameters"]["query"];

/** `GET /account/v1/subscription-items` 成功时的响应体。 */
export type ListSubscriptionItemsResult =
  operations["list-subscription-items"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/subscription-items` 的查询参数。 */
export type ListSubscriptionItemsQuery =
  operations["list-subscription-items"]["parameters"]["query"];

/** `POST /account/v1/subscription-items/{itemId}/renew` 成功时的响应体。 */
export type RenewSubscriptionItemResult =
  operations["renew-subscription-item"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/subscription-items/{itemId}/renew` 的请求体。 */
export type RenewSubscriptionItemBody = NonNullable<
  operations["renew-subscription-item"]["requestBody"]
>["content"]["application/json"];

/** `PUT /account/v1/subscription-items/{itemId}/auto-renew` 成功时的响应体。 */
export type SetAutoRenewResult =
  operations["set-auto-renew"]["responses"][200]["content"]["application/json"];

/** `PUT /account/v1/subscription-items/{itemId}/auto-renew` 的请求体。 */
export type SetAutoRenewBody = NonNullable<
  operations["set-auto-renew"]["requestBody"]
>["content"]["application/json"];

/** `POST /account/v1/codes/preview` 成功时的响应体。 */
export type PreviewCodeResult =
  operations["preview-code"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/codes/preview` 的请求体。 */
export type PreviewCodeBody = NonNullable<
  operations["preview-code"]["requestBody"]
>["content"]["application/json"];

/** `POST /account/v1/codes/redeem` 成功时的响应体。 */
export type RedeemCodeResult =
  operations["redeem-code"]["responses"][200]["content"]["application/json"];

/** `POST /account/v1/codes/redeem` 的请求体。 */
export type RedeemCodeBody = NonNullable<
  operations["redeem-code"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/billing-account` 成功时的响应体。 */
export type GetProjectBillingAccountResult =
  operations["get-project-billing-account"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/spend` 成功时的响应体。 */
export type ListProjectSpendResult =
  operations["list-project-spend"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/spend` 的查询参数。 */
export type ListProjectSpendQuery =
  operations["list-project-spend"]["parameters"]["query"];

/** `GET /api/v1/projects/{projectId}/usage-charges` 成功时的响应体。 */
export type ListProjectUsageChargesResult =
  operations["list-project-usage-charges"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/usage-charges` 的查询参数。 */
export type ListProjectUsageChargesQuery =
  operations["list-project-usage-charges"]["parameters"]["query"];

/** `GET /api/v1/projects/{projectId}/subscriptions` 成功时的响应体。 */
export type ListProjectSubscriptionsResult =
  operations["list-project-subscriptions"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/subscription-items` 成功时的响应体。 */
export type ListProjectSubscriptionItemsResult =
  operations["list-project-subscription-items"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/subscription-items` 的查询参数。 */
export type ListProjectSubscriptionItemsQuery =
  operations["list-project-subscription-items"]["parameters"]["query"];

/** `PUT /api/v1/projects/{projectId}/subscription-items/{itemId}/auto-renew` 成功时的响应体。 */
export type SetProjectAutoRenewResult =
  operations["set-project-auto-renew"]["responses"][200]["content"]["application/json"];

/** `PUT /api/v1/projects/{projectId}/subscription-items/{itemId}/auto-renew` 的请求体。 */
export type SetProjectAutoRenewBody = NonNullable<
  operations["set-project-auto-renew"]["requestBody"]
>["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/orders` 成功时的响应体。 */
export type ListProjectOrdersResult =
  operations["list-project-orders"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/orders` 的查询参数。 */
export type ListProjectOrdersQuery =
  operations["list-project-orders"]["parameters"]["query"];

/** `GET /api/v1/projects/{projectId}/orders/{orderId}` 成功时的响应体。 */
export type GetProjectOrderResult =
  operations["get-project-order"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/active-resources` 成功时的响应体。 */
export type ListProjectActiveResourcesResult =
  operations["list-project-active-resources"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/active-resources` 的查询参数。 */
export type ListProjectActiveResourcesQuery =
  operations["list-project-active-resources"]["parameters"]["query"];

/** `POST /api/v1/projects/{projectId}/quotes` 成功时的响应体。 */
export type CreateProjectQuoteResult =
  operations["create-project-quote"]["responses"][200]["content"]["application/json"];

/** `POST /api/v1/projects/{projectId}/quotes` 的请求体。 */
export type CreateProjectQuoteBody = NonNullable<
  operations["create-project-quote"]["requestBody"]
>["content"]["application/json"];

/** `GET /account/v1/allowances` 成功时的响应体。 */
export type ListAllowancesResult =
  operations["list-allowances"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/allowances` 的查询参数。 */
export type ListAllowancesQuery =
  operations["list-allowances"]["parameters"]["query"];

/** `GET /account/v1/allowances/{allowanceId}/consumptions` 成功时的响应体。 */
export type ListAllowanceConsumptionsResult =
  operations["list-allowance-consumptions"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/orders` 成功时的响应体。 */
export type ListOrdersResult =
  operations["list-orders"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/orders` 的查询参数。 */
export type ListOrdersQuery =
  operations["list-orders"]["parameters"]["query"];

/** `GET /account/v1/orders/{orderId}` 成功时的响应体。 */
export type GetOrderResult =
  operations["get-order"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/orders/{orderId}/items` 成功时的响应体。 */
export type ListOrderItemsResult =
  operations["list-order-items"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/orders/{orderId}/items` 成功时的响应体。 */
export type ListProjectOrderItemsResult =
  operations["list-project-order-items"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/allowances` 成功时的响应体。 */
export type ListProjectAllowancesResult =
  operations["list-project-allowances"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/allowances` 的查询参数。 */
export type ListProjectAllowancesQuery =
  operations["list-project-allowances"]["parameters"]["query"];

/** `GET /account/v1/entitlements` 成功时的响应体。 */
export type ListEntitlementsResult =
  operations["list-entitlements"]["responses"][200]["content"]["application/json"];

/** `GET /account/v1/entitlements` 的查询参数。 */
export type ListEntitlementsQuery =
  operations["list-entitlements"]["parameters"]["query"];

/** `GET /api/v1/projects/{projectId}/entitlements` 成功时的响应体。 */
export type ListProjectEntitlementsResult =
  operations["list-project-entitlements"]["responses"][200]["content"]["application/json"];

/** `GET /api/v1/projects/{projectId}/entitlements` 的查询参数。 */
export type ListProjectEntitlementsQuery =
  operations["list-project-entitlements"]["parameters"]["query"];
