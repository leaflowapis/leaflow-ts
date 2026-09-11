// Code generated from the contract's servers[0]. DO NOT EDIT.

import createClient, { type ClientOptions } from "openapi-fetch";

import type { paths } from "./schema.js";

/** A client for the billing service. Pass baseUrl to override the address. */
export function client(options: ClientOptions & { baseUrl: string }) {
  return createClient<paths>(options);
}
