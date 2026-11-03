import assert from "node:assert/strict";
import test from "node:test";
import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import {
  ApplicationService,
  LauncherConfirmation,
  LaunchApplicationResponseSchema,
  OpenRequestSchema,
  OpenResponseSchema,
  OpenUriResponseSchema,
} from "@leaflow/sdk/proto/leaflow/fleet/virtualdesktop/application/v1/application_pb";

test("ApplicationService 原生 Open 方法使用对应请求和响应", () => {
  const method = ApplicationService.method.open;
  assert.equal(method.name, "Open");
  assert.equal(method.methodKind, "unary");
  assert.equal(method.input, OpenRequestSchema);
  assert.equal(method.output, OpenResponseSchema);
  assert.deepEqual(
    OpenRequestSchema.fields.map((field) => [field.name, field.number]),
    [
      ["target", 1],
      ["arguments", 2],
      ["action_id", 3],
      ["uris", 4],
      ["launcher_confirmation", 5],
    ],
  );
});

test("Open 请求完整保留路径、参数、桌面动作和启动器确认", () => {
  for (const input of [
    {
      target: "/opt/示例程序/bin/editor",
      arguments: ["--title", "含 空格", "$(不应展开)", ""],
    },
    {
      target: "org.gnome.TextEditor.desktop",
      actionId: "new-window",
      uris: ["file:///home/user/%E6%96%87%E6%A1%A3.txt", "https://example.com/document"],
      launcherConfirmation: LauncherConfirmation.MARK_TRUSTED,
    },
    { target: "file:///home/user/document.txt" },
  ]) {
    const request = create(OpenRequestSchema, input);
    assert.deepEqual(fromBinary(OpenRequestSchema, toBinary(OpenRequestSchema, request)), request);
  }
});

for (const schema of [OpenResponseSchema, LaunchApplicationResponseSchema, OpenUriResponseSchema]) {
  test(`${schema.name} 保留启动结果、64 位窗口和可选 pid 的存在性`, () => {
    assert.deepEqual(
      schema.fields.map((field) => [field.name, field.number]),
      [
        ["startup_id", 1],
        ["window_id", 2],
        ["revision", 3],
        ["pid", 4],
      ],
    );
    const response = create(schema, {
      startupId: "startup-open-sdk-test",
      windowId: 9007199254740993n,
      revision: 9007199254740995n,
      pid: 12345,
    });
    assert.deepEqual(fromBinary(schema, toBinary(schema, response)), response);

    const absent = fromBinary(schema, toBinary(schema, create(schema, {})));
    assert.equal(absent.windowId, undefined);
    assert.equal(absent.pid, undefined);
    const zero = fromBinary(schema, toBinary(schema, create(schema, { windowId: 0n, pid: 0 })));
    assert.equal(zero.windowId, 0n);
    assert.equal(zero.pid, 0);
  });
}
