# Leaflow TypeScript SDK

TypeScript SDK for the Leaflow platform, generated from the [leaflowapis](https://github.com/leaflowapis/leaflowapis) contracts.

```sh
npm install @leaflow/sdk
```

Clients, models, and request validation schemas live under `src/<service>/<version>/generated`. Validate requests with the generated schemas before calling an operation.

## Generate and build

```sh
npm ci
git clone https://github.com/leaflowapis/leaflowapis.git leaflowapis
git -C leaflowapis checkout --detach "$(cat CONTRACTS_REF)"
npm run generate
npm run build
```

The contract version is recorded in `CONTRACTS_REF`. `CONTRACTS_DIR` may point to a clean checkout at that ref.

## Protocol messages

Protobuf messages from the contract are generated with protoc-gen-es under `src/proto`, preserving their
proto paths. Import them by path and encode or decode with `@bufbuild/protobuf`:

```ts
import { create, toBinary } from "@bufbuild/protobuf";
import { ClientMessageSchema } from "@leaflow/sdk/proto/leaflow/fleet/control/v1/control_pb";

const bytes = toBinary(ClientMessageSchema, create(ClientMessageSchema, {}));
```

`npm run generate` runs Orval and then `buf generate` on the same contract checkout.
