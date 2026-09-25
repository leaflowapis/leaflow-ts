# leaflow-ts

Leaflow 平台的 TypeScript SDK(`@leaflow/sdk`),由
[leaflowapis](https://github.com/leaflowapis/leaflowapis) 生成。

```
npm i @leaflow/sdk openapi-fetch
```

包含 Node.js 可用的 JavaScript 客户端和 TypeScript 类型。请求由 `openapi-fetch` 发出，路径与参数由契约约束。

```ts
import createClient from 'openapi-fetch';
import type { compute } from '@leaflow/sdk';

const api = createClient<compute.paths>({
    baseUrl: 'https://compute.leaflow.cloud',
    headers: { Authorization: `Bearer ${token}` },
});

const { data, error } = await api.GET('/api/v1/instances', {
    params: { query: { limit: 20 } },
});
```

每个操作另有 `<操作>Result` / `<操作>Body` / `<操作>Query` 三个类型别名。

## 重新生成

```
npm run generate
```

契约版本记在 `CONTRACTS_REF`。

## Billing

Billing 按职能分为三个子包,三者地址相同,凭据各不相同:

```ts
import { billing } from "@leaflow/sdk";

// 公开目录与估价,无需凭据
const catalog = billing.catalog.client();
// 计费账户、充值、账单,使用 access token
const account = billing.account.client({ headers });
// 项目的支出与订单,使用 scoped token
const project = billing.project.client({ headers });
```

也可按子路径单独导入,例如 `@leaflow/sdk/billing/catalog/v1`。

公共目录、账户和项目接口使用 `@leaflow/sdk`，运营管理接口使用 `@leaflow/sdk-admin`。服务间 Proto 使用独立的 `@leaflow/billing` 包。

本地契约可通过 `CONTRACTS_DIR=/absolute/path/to/contracts npm run generate` 生成。发布时将契约提交号写入 `CONTRACTS_REF`，再使用默认生成命令。
