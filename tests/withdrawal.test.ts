import assert from "node:assert/strict";
import test from "node:test";
import { previewWithdrawal, createWithdrawal, schemas } from "../dist/billing/v1/index.js";
import { WithdrawalItem } from "../dist/billing/v1/generated/validators/withdrawalItem.zod.js";

const sourceId = "60000000-0000-4000-8000-000000000001";
const withdrawalId = "60000000-0000-4000-8000-000000000002";
const allocation = {
  source_transaction_id: sourceId,
  amount: "20.0000000000",
  fee_amount: "0.7300000000",
  refund_amount: "19.2700000000",
};
const source = {
  amount: "100.0000000000",
  currency: "USD",
  received_at: "2026-10-11T00:00:00Z",
  payment_gateway: "stripe",
  method_type: "card",
  card_brand: "visa",
  card_last4: "4242",
};
const preview = {
  billing_account_id: 42,
  currency: "USD",
  available_amount: "100.0000000000",
  amount: allocation.amount,
  fee_amount: allocation.fee_amount,
  refund_amount: allocation.refund_amount,
  items: [{ ...allocation, source }],
};

test("native preview and creation preserve exact confirmed amounts and retry identity", async () => {
  const requests: { method?: string; path: string; body: unknown }[] = [];
  const transport: typeof fetch = async (url, init) => {
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer withdrawal-test");
    const path = new URL(String(url), "http://localhost").pathname;
    requests.push({ method: init?.method, path, body: JSON.parse(String(init?.body)) });
    return path.endsWith("/preview")
      ? Response.json(preview)
      : Response.json({ id: withdrawalId }, { status: 201 });
  };
  const options = { headers: { Authorization: "Bearer withdrawal-test" } };
  const result = await previewWithdrawal(
    schemas.PreviewWithdrawalBody.parse({ billing_account_id: 42, amount: "20" }),
    options,
    transport,
  );
  if (result.status !== 200) throw new Error("preview failed");
  assert.deepEqual(result.data, preview);
  const body = {
    id: withdrawalId,
    billing_account_id: 42,
    amount: result.data.amount,
    expected_refund_amount: result.data.refund_amount,
    expected_items: result.data.items.map(
      ({ source_transaction_id, amount, fee_amount, refund_amount }) => ({
        source_transaction_id,
        amount,
        fee_amount,
        refund_amount,
      }),
    ),
  };
  assert.equal(
    schemas.CreateWithdrawalBody.safeParse({ ...body, expected_items: result.data.items }).success,
    false,
  );
  const accepted = schemas.CreateWithdrawalBody.parse(body);
  await createWithdrawal(accepted, options, transport);
  await createWithdrawal(accepted, options, transport);
  assert.deepEqual(
    requests.map(({ method, path }) => ({ method, path })),
    [
      { method: "POST", path: "/api/v1/withdrawals/preview" },
      { method: "POST", path: "/api/v1/withdrawals" },
      { method: "POST", path: "/api/v1/withdrawals" },
    ],
  );
  assert.deepEqual(requests[1]?.body, body);
  assert.deepEqual(requests[2]?.body, body);
});

test("withdrawal source details and failure codes preserve presence", () => {
  const item = {
    ...allocation,
    id: withdrawalId,
    withdrawal_id: withdrawalId,
    billing_account_id: 42,
    currency: "USD",
    refund_id: sourceId,
    status: "failed",
    payment_gateway: "stripe",
    method_type: "card",
    source,
    failure_code: "lost_or_stolen_card",
  };
  assert.deepEqual(WithdrawalItem.parse(item), item);
  const { failure_code, ...pending } = item;
  assert.equal(
    Object.hasOwn(WithdrawalItem.parse({ ...pending, status: "pending" }), "failure_code"),
    false,
  );
  assert.equal(WithdrawalItem.safeParse({ ...item, failure_code: null }).success, false);
  assert.equal(
    WithdrawalItem.safeParse({ ...item, source: { ...source, card_last4: "424242" } }).success,
    false,
  );
  assert.equal(WithdrawalItem.safeParse({ ...item, refund_amount: 19.27 }).success, false);
});
