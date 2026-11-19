import assert from "node:assert/strict";
import test from "node:test";
import { ResponseDecodeError } from "../dist/index.js";
import { decodeResponse } from "../dist/response.js";
import type { ErrorResponse } from "../dist/billing/v1/generated/models.js";
import {
  getBillingAccount,
  downloadInvoicePdf,
  downloadExport,
  deleteContact,
} from "../dist/billing/v1/generated/functions.js";

const id = "60000000-0000-4000-8000-000000000001";
const endpoints = [
  {
    name: "JSON account",
    call: (fetchFn: typeof fetch) => getBillingAccount(42, undefined, fetchFn),
  },
  {
    name: "PDF invoice",
    call: (fetchFn: typeof fetch) => downloadInvoicePdf(id, undefined, undefined, fetchFn),
  },
  { name: "CSV export", call: (fetchFn: typeof fetch) => downloadExport(id, undefined, fetchFn) },
];

for (const endpoint of endpoints) {
  test(`${endpoint.name}: valid JSON errors retain envelope, status and headers`, async () => {
    const data: ErrorResponse = {
      error: {
        code: 503,
        status: "UNAVAILABLE",
        message: "Temporarily unavailable",
        reason: "INTERNAL_ERROR",
        metadata: { attempt: "1" },
        request_id: "test-only",
        retry_delay: "17s",
      },
    };
    const response = Response.json(data, { status: 503, headers: { "Retry-After": "17" } });
    const result = await endpoint.call(async () => response);
    assert.deepEqual(result.data, data);
    assert.equal(result.status, 503);
    assert.equal(result.headers, response.headers);
    assert.equal(result.headers.get("Retry-After"), "17");
  });

  for (const contentType of [
    "text/html",
    "application/json",
    "Application/Problem+JSON; charset=utf-8",
    "",
  ]) {
    test(`${endpoint.name}: malformed 503 (${contentType || "missing media type"}) is diagnosable`, async () => {
      const rawBody = "<html>temporarily unavailable\n请求稍后重试</html>";
      const response = new Response(rawBody, {
        status: 503,
        headers: { ...(contentType ? { "Content-Type": contentType } : {}), "Retry-After": "23" },
      });
      if (!contentType) response.headers.delete("Content-Type");
      await assert.rejects(
        endpoint.call(async () => response),
        (error: unknown) => {
          assert.ok(error instanceof ResponseDecodeError);
          assert.equal(error.status, 503);
          assert.equal(error.headers, response.headers);
          assert.equal(error.headers.get("Retry-After"), "23");
          assert.equal(error.rawBody, rawBody);
          assert.ok(error.cause instanceof SyntaxError);
          return true;
        },
      );
    });
  }
}

test("successful JSON keeps the existing result shape and injected fetch signature", async () => {
  const data = { id: 42, currency: "USD", status: "active" };
  const response = Response.json(data, { headers: { "X-Request-ID": "offline" } });
  const result = await getBillingAccount(
    42,
    { headers: { Authorization: "Bearer test-only" } },
    async (url, init) => {
      assert.match(String(url), /\/billing-accounts\/42$/);
      assert.equal(init?.method, "GET");
      assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer test-only");
      return response;
    },
  );
  assert.deepEqual(result, { data, status: 200, headers: response.headers });
});

test("malformed successful JSON keeps parse diagnostics too", async () => {
  await assert.rejects(
    getBillingAccount(42, undefined, async () => new Response("{", { status: 200 })),
    (error: unknown) => {
      assert.ok(error instanceof ResponseDecodeError);
      assert.equal(error.status, 200);
      assert.equal(error.rawBody, "{");
      assert.ok(error.cause instanceof SyntaxError);
      return true;
    },
  );
});

for (const [name, contentType, bytes] of [
  ["PDF", "application/pdf", new Uint8Array([37, 80, 68, 70, 0, 255, 128])],
  [
    "CSV",
    "text/csv; charset=utf-8",
    new TextEncoder().encode("\uFEFFid,金额\r\n42,20.0000000000\r\n"),
  ],
] as const) {
  test(`${name} download retains exact binary bytes`, async () => {
    const response = new Response(bytes, { headers: { "Content-Type": contentType } });
    const result =
      name === "PDF"
        ? await downloadInvoicePdf(id, undefined, undefined, async () => response)
        : await downloadExport(id, undefined, async () => response);
    assert.equal(result.status, 200);
    assert.equal(result.headers, response.headers);
    assert.ok(result.data instanceof Blob);
    assert.deepEqual(new Uint8Array(await result.data.arrayBuffer()), bytes);
  });
}

for (const status of [204, 205, 304]) {
  test(`HTTP ${status} never reads a body and preserves endpoint empty values`, async () => {
    const response = new Response(null, { status, headers: { "Retry-After": "9" } });
    response.text = async () => {
      throw new Error("must not read text");
    };
    response.blob = async () => {
      throw new Error("must not read binary");
    };
    for (const endpoint of endpoints) {
      const result = await endpoint.call(async () => response);
      assert.equal(result.status, status);
      assert.equal(result.headers, response.headers);
      assert.deepEqual(result.data, endpoint.name === "JSON account" ? {} : null);
    }
    const deleted = await deleteContact(42, id, undefined, async () => response);
    assert.equal(deleted.data, undefined);
    assert.equal(deleted.status, status);
    assert.equal(deleted.headers, response.headers);
  });
}

test("plain text and empty JSON decoding do not regress", async () => {
  assert.equal(
    await decodeResponse(new Response("csv is text here"), { "200": "text" }, ""),
    "csv is text here",
  );
  assert.deepEqual(await decodeResponse(new Response(""), { "200": "json" }, {}), {});
  const data = { reason: "PERMISSION_DENIED" };
  assert.deepEqual(
    await decodeResponse(
      new Response(JSON.stringify(data), {
        status: 403,
        headers: { "Content-Type": "APPLICATION/PROBLEM+JSON; charset=utf-8" },
      }),
      { "200": "blob", default: "json" },
      null,
    ),
    data,
  );
});

test("fetch failures propagate without being mislabeled as decoding failures", async () => {
  const cause = new Error("offline transport failure");
  await assert.rejects(
    getBillingAccount(42, undefined, async () => {
      throw cause;
    }),
    (error: unknown) => error === cause,
  );
});
