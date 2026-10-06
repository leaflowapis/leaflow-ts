import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { getContact, updateContact, deleteContact, schemas } from "../dist/billing/v1/index.js";

const contactId = "60000000-0000-4000-8000-000000000001";

test("native contact requests retain the account parent, payload and authorization", async (t) => {
  const requests: { method: string; path: string; authorization?: string; body: string }[] = [];
  const expected = `/api/v1/billing-accounts/42/contacts/${contactId}`;
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    requests.push({
      method: request.method!,
      path: request.url!,
      authorization: request.headers.authorization,
      body,
    });
    response.setHeader("Content-Type", "application/json");
    if (request.url !== expected) {
      response.writeHead(404).end(
        JSON.stringify({
          code: "BILLING_CONTACT_NOT_FOUND",
          message: "contact is not in this account",
        }),
      );
    } else if (request.method === "DELETE") {
      response.writeHead(204).end();
    } else {
      response.end(
        JSON.stringify({
          id: contactId,
          billing_account_id: 42,
          name: request.method === "PATCH" ? "Updated" : "Finance",
          active: true,
          tax_exempt: false,
          created_at: "2026-10-06T00:00:00Z",
        }),
      );
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  );
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const transport: typeof fetch = (url, init) => {
    const generated = new URL(String(url), base);
    return fetch(`${base}${generated.pathname}${generated.search}`, init);
  };
  const options = { headers: { Authorization: "Bearer contact-test-token" } };
  const get = schemas.GetContactParams.parse({ accountId: 42, contactId });
  assert.equal((await getContact(get.accountId, get.contactId, options, transport)).status, 200);
  const patch = schemas.UpdateContactParams.parse({ accountId: 42, contactId });
  const body = schemas.UpdateContactBody.parse({ name: "Updated" });
  assert.equal(
    (await updateContact(patch.accountId, patch.contactId, body, options, transport)).status,
    200,
  );
  const remove = schemas.DeleteContactParams.parse({ accountId: 42, contactId });
  assert.equal(
    (await deleteContact(remove.accountId, remove.contactId, options, transport)).status,
    204,
  );
  assert.equal((await getContact(99, contactId, options, transport)).status, 404);
  assert.deepEqual(
    requests.map(({ method, path }) => ({ method, path })),
    [
      { method: "GET", path: expected },
      { method: "PATCH", path: expected },
      { method: "DELETE", path: expected },
      { method: "GET", path: `/api/v1/billing-accounts/99/contacts/${contactId}` },
    ],
  );
  assert.ok(requests.every((request) => request.authorization === options.headers.Authorization));
  assert.deepEqual(JSON.parse(requests[1]!.body), { name: "Updated" });
  assert.ok(requests.filter(({ method }) => method !== "PATCH").every(({ body }) => body === ""));
  for (const schema of [
    schemas.GetContactParams,
    schemas.UpdateContactParams,
    schemas.DeleteContactParams,
  ]) {
    for (const invalid of [
      { contactId },
      { accountId: "42", contactId },
      { accountId: 42.5, contactId },
      { accountId: 42, contactId: "other/contact" },
    ]) {
      assert.equal(schema.safeParse(invalid).success, false);
    }
  }
  const unsafeAccount = "42/other?account=99" as unknown as number;
  const unsafeContact = "other/contact?admin=true";
  await getContact(unsafeAccount, unsafeContact, options, transport);
  await updateContact(unsafeAccount, unsafeContact, body, options, transport);
  await deleteContact(unsafeAccount, unsafeContact, options, transport);
  const encoded = `/api/v1/billing-accounts/${encodeURIComponent(String(unsafeAccount))}/contacts/${encodeURIComponent(unsafeContact)}`;
  assert.deepEqual(
    requests.slice(4).map(({ path }) => path),
    [encoded, encoded, encoded],
  );
});
