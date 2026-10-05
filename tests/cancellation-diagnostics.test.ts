import assert from "node:assert/strict";
import test from "node:test";
import { getCancellation } from "../dist/billing/v1/generated/functions.js";
import { CancellationItem as Item } from "../dist/billing/v1/generated/validators/cancellationItem.zod.js";
import type { CancellationItem } from "../dist/billing/v1/generated/models.js";

const base: CancellationItem = {
  id: "bb3b9c54-99ea-4aef-b375-ec61df426d5c",
  subscription_id: "74825f39-3b5a-47be-ae44-0b8f55a39f0b",
  plan_id: "2289b2ca-cfa8-4ae9-9b11-c76b93a78593",
  plan_name: "Plan",
  status: "releasing",
  billing_type: "prepaid",
};
const exposesReason: "failure_reason" extends keyof CancellationItem ? true : false = false;

for (const row of [
  { name: "absent", diagnostic: {} },
  { name: "explicit empty", diagnostic: { failure_code: "" } },
  { name: "stopped", diagnostic: { failure_code: "COMPUTE_RELEASE_FAILED" } },
  { name: "unknown outcome", diagnostic: { failure_code: "COMPUTE_RELEASE_RESULT_UNKNOWN" } },
]) {
  test(`native fetch and schema retain diagnostic presence: ${row.name}`, async () => {
    const item = { ...base, ...row.diagnostic };
    const token = "isolated-test-credential";
    const fakeFetch: typeof fetch = async (url, options) => {
      assert.match(String(url), /\/api\/v1\/cancellations\//);
      assert.equal(options?.method, "GET");
      assert.equal(new Headers(options?.headers).get("Authorization"), `Bearer ${token}`);
      return Response.json({ id: base.id, status: "releasing", items: [item] });
    };
    const response = await getCancellation(
      base.id,
      { headers: { Authorization: `Bearer ${token}` } },
      fakeFetch,
    );
    if (response.status !== 200) throw new Error("unexpected response status");
    const parsed = Item.parse(response.data.items[0]);
    for (const key of ["failure_code"]) {
      assert.equal(Object.hasOwn(parsed, key), Object.hasOwn(row.diagnostic, key));
      assert.equal(Reflect.get(parsed, key), Reflect.get(row.diagnostic, key));
    }
    assert.equal(parsed.status, "releasing");
    for (const key of ["effective_at", "balance_amount", "credit_amount", "gateway_amount"])
      assert.equal(Object.hasOwn(parsed, key), false);
    assert.equal(exposesReason, false);
    assert.equal(Object.hasOwn(parsed, "failure_reason"), false);
  });
}

test("diagnostic strings reject null and preserve existing cancellation statuses", () => {
  for (const key of ["failure_code"])
    assert.equal(Item.safeParse({ ...base, [key]: null }).success, false);
  for (const status of ["requested", "scheduled", "releasing", "completed", "canceled", "failed"])
    assert.equal(Item.safeParse({ ...base, status }).success, true);
  assert.equal(
    Item.safeParse({ ...base, failure_reason: "Private operator diagnostic" }).success,
    false,
  );
});
