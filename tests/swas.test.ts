import assert from "node:assert/strict";
import test from "node:test";
import * as swas from "../dist/swas/v1/index.js";
import { routes } from "../dist/routes.js";

const id = "10000000-0000-4000-8000-000000000001";
const operation = "20000000-0000-4000-8000-000000000002";
const cancellation = "30000000-0000-4000-8000-000000000003";
const headers = { "Idempotency-Key": "swas-contract-test" };
const options = { headers: { Authorization: "Bearer synthetic-scoped-token" } };
const purchase = {
  catalog_revision: 1,
  provider_plan_id: "synthetic-plan",
  billing_price_id: id,
  image_id: "synthetic-image",
  quantity: 1 as const,
  region_id: "synthetic-region",
  expected_quote: { currency: "USD" as const, amount: "10.0000000001" },
};

test("native SWAS functions preserve all ten methods, custom verbs and credentials without network", async () => {
  const requests: { method: string; url: string; headers: Headers; body: unknown }[] = [];
  const transport: typeof fetch = async (url, init) => {
    requests.push({
      method: init!.method!,
      url: String(url),
      headers: new Headers(init!.headers),
      body: init?.body ? JSON.parse(String(init.body)) : null,
    });
    return new Response(JSON.stringify({ synthetic: true }), {
      status: init?.method === "POST" ? 202 : 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  const query = { region_id: "synthetic-region", page: 1, page_size: 50 };
  await swas.listPlans({ region_id: query.region_id }, options, transport);
  await swas.createPurchase(purchase, headers, options, transport);
  await swas.getPurchase(id, options, transport);
  await swas.listInstances(query, options, transport);
  await swas.getInstance(id, options, transport);
  await swas.startInstance(id, {}, headers, options, transport);
  await swas.getInstanceOperation(id, operation, options, transport);
  await swas.stopInstance(id, {}, headers, options, transport);
  await swas.getCancellationRefundProgress(id, cancellation, options, transport);
  await swas.rebootInstance(id, {}, headers, options, transport);
  assert.deepEqual(
    requests.map(({ method, url }) => [method, new URL(url).pathname + new URL(url).search]),
    [
      ["GET", "/api/v1/catalog/plans?region_id=synthetic-region"],
      ["POST", "/api/v1/purchases"],
      ["GET", `/api/v1/purchases/${id}`],
      ["GET", "/api/v1/instances?region_id=synthetic-region&page=1&page_size=50"],
      ["GET", `/api/v1/instances/${id}`],
      ["POST", `/api/v1/instances/${id}:start`],
      ["GET", `/api/v1/instances/${id}/operations/${operation}`],
      ["POST", `/api/v1/instances/${id}:stop`],
      ["GET", `/api/v1/instances/${id}/cancellations/${cancellation}/refund-progress`],
      ["POST", `/api/v1/instances/${id}:reboot`],
    ],
  );
  assert.ok(requests.every((r) => new URL(r.url).origin === "https://swas.leaflow.cloud"));
  assert.ok(
    requests.every((r) => r.headers.get("Authorization") === options.headers.Authorization),
  );
  assert.deepEqual(requests[1]!.body, purchase);
  for (const r of requests.filter((r) => r.method === "POST")) {
    assert.equal(r.headers.get("Idempotency-Key"), headers["Idempotency-Key"]);
    assert.equal(r.headers.get("Content-Type"), "application/json");
  }
  for (const index of [5, 7, 9]) assert.deepEqual(requests[index]!.body, {});
  assert.match(swas.getGetInstanceUrl("x/y"), /x%2Fy$/);
});

test("native request schemas use shared pagination and retain precision and strict ownership inputs", () => {
  assert.deepEqual(swas.schemas.ListInstancesQueryParams.parse({ region_id: "synthetic-region" }), {
    region_id: "synthetic-region",
    page: 1,
    page_size: 50,
  });
  assert.equal(
    swas.schemas.ListInstancesQueryParams.parse({ region_id: "x", page_size: 200 }).page_size,
    200,
  );
  for (const invalid of [
    { region_id: "x", page_size: 201 },
    { region_id: "x", page: 0 },
    { region_id: "x", project_id: id },
    { region_id: "x", page: 2147483648 },
  ]) {
    assert.equal(swas.schemas.ListInstancesQueryParams.safeParse(invalid).success, false);
  }
  assert.equal(
    swas.schemas.CreatePurchaseBody.parse(purchase).expected_quote.amount,
    "10.0000000001",
  );
  for (const amount of [1, "-1", "1e3", "1.00000000001"]) {
    assert.equal(
      swas.schemas.CreatePurchaseBody.safeParse({
        ...purchase,
        expected_quote: { currency: "USD", amount },
      }).success,
      false,
    );
  }
  for (const action of ["Start", "Stop", "Reboot"]) {
    const schemas = swas.schemas as Record<string, { safeParse(v: unknown): { success: boolean } }>;
    assert.equal(schemas[`${action}InstanceBody`]!.safeParse({}).success, true);
    assert.equal(schemas[`${action}InstanceBody`]!.safeParse({ project_id: id }).success, false);
    assert.equal(schemas[`${action}InstanceHeader`]!.safeParse({}).success, false);
  }
});

test("native SWAS routing metadata is complete and keeps legacy operations present", () => {
  const own = routes.filter((r) => r.service === "swas");
  assert.equal(own.length, 10);
  assert.equal(routes.filter((r) => r.service === "swas-legacy").length, 16);
  assert.ok(
    own.every(
      (r) =>
        r.contract === "swas" &&
        r.securityScheme === "ScopedToken" &&
        r.upstreamUrl === "https://swas.leaflow.cloud",
    ),
  );
  for (const action of ["start", "stop", "reboot"]) {
    assert.ok(
      own.some((r) => r.method === "POST" && r.path === `/api/v1/instances/{instanceId}:${action}`),
    );
    assert.ok(!own.some((r) => r.path === `/api/v1/instances/{instanceId}/${action}`));
  }
});

test("native response functions preserve the shared error envelope and unknown refund values", async () => {
  const error = { status: 403, message: "Permission denied", code: "SCOPE_DENIED", meta: {} };
  const errorReply = await swas.getInstance(
    id,
    options,
    async () => new Response(JSON.stringify(error), { status: 403 }),
  );
  assert.equal(errorReply.status, 403);
  assert.deepEqual(errorReply.data, error);
  const refund = {
    purchase_id: id,
    cancellation_id: cancellation,
    cancellation_state: "completed",
    customer_refund: {
      state: "unknown",
      reason: "billing_refund_reader_unavailable",
      amount: null,
      currency: null,
    },
    supplier_refund: { state: "not_observed", reason: "supplier_refund_not_queried" },
    observed_at: "2026-10-25T00:00:00Z",
  };
  const reply = await swas.getCancellationRefundProgress(
    id,
    cancellation,
    options,
    async () => new Response(JSON.stringify(refund), { status: 200 }),
  );
  assert.deepEqual(reply.data, refund);
  assert.deepEqual(swas.responseSchemas.Error.parse(error), error);
  assert.equal(swas.responseSchemas.Error.safeParse({ code: "SCOPE_DENIED" }).success, false);
  assert.deepEqual(swas.responseSchemas.RefundProgress.parse(refund), refund);
  assert.equal(
    swas.responseSchemas.RefundProgress.safeParse({
      ...refund,
      customer_refund: { ...refund.customer_refund, amount: "0", currency: "USD" },
    }).success,
    false,
  );
  assert.equal(
    swas.responseSchemas.InstanceList.safeParse({
      items: [],
      pagination: { page: 1, page_size: 50, total_count: 0 },
    }).success,
    true,
  );
  assert.equal(
    swas.responseSchemas.InstanceList.safeParse({
      items: [],
      pagination: { page: 1, page_size: 50, total: 0 },
    }).success,
    false,
  );
});
