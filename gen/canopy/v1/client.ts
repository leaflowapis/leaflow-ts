// Code generated from the contract's servers[0]. DO NOT EDIT.

import createClient, { type ClientOptions } from "openapi-fetch";

import type { paths } from "./schema.js";

const defaultBaseUrl = "https://canopy.leaflow.cloud";

/** A client for the canopy service. Pass baseUrl to override the address. */
export function client(options: ClientOptions = {}) {
  return createClient<paths>({ baseUrl: defaultBaseUrl, ...options });
}
