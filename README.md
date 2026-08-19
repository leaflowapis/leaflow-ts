# leaflow-ts

Leaflow 平台的 TypeScript SDK(`@leaflow/sdk`)。
`gen/` 下全是产物,源在 `LeaflowNET/leaflowapis`。

## 为什么和 Go 分开在两个仓库

**它们在同一个仓库里会抢同一个 tag 空间。** Go 的子目录模块要 `go/v1.2.3` 这种带前缀的 tag,
npm 要 `v1.2.3`——上一版两者挤在一个仓库里,结果是 Go 那半从来没被正确发布过,而没有任何东西
会报错(`go get` 只是拿不到)。

## 契约是一个 submodule

```
leaflowapis/    钉在某一个 commit 上——那个指针就是「这版 SDK 出自哪版契约」的答案
```

```
git submodule update --remote leaflowapis   # 要跟进新契约时才做
npm run generate
```

产物由人在本地跑完提交,CI 只验证不写回:一个会 commit 回来的流水线,在两次推送挨得近时只能靠
重试或者强推——前者会打架,后者会丢东西。
