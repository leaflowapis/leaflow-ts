# leaflow-ts

Leaflow 平台的 TypeScript SDK(`@leaflow/sdk`),由
[leaflowapis](https://github.com/leaflowapis/leaflowapis) 生成。

```
npm i @leaflow/sdk openapi-fetch
```

当前只含类型。请求由 `openapi-fetch` 发出,路径与参数由契约约束。

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
