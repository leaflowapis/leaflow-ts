export type ResponseBodyMode = "json" | "blob" | "text";

export class ResponseDecodeError extends Error {
  readonly status: number;
  readonly headers: Headers;
  readonly rawBody: string;

  constructor(response: Response, rawBody: string, cause: unknown) {
    super(`Failed to decode HTTP ${response.status} response`, { cause });
    this.name = "ResponseDecodeError";
    this.status = response.status;
    this.headers = response.headers;
    this.rawBody = rawBody;
  }
}

export async function decodeResponse(
  response: Response,
  modes: Readonly<Record<string, ResponseBodyMode>>,
  emptyBody: unknown,
): Promise<unknown> {
  if ([204, 205, 304].includes(response.status)) return emptyBody;

  const contentType = (response.headers.get("content-type") ?? "")
    .split(";", 1)[0]!
    .trim()
    .toLowerCase();
  const declaredMode =
    modes[String(response.status)] ??
    modes[`${Math.floor(response.status / 100)}XX`] ??
    modes.default ??
    "json";
  // 二进制操作也可能返回 JSON 错误；缺失或错误的媒体类型不能掩盖契约要求的 JSON 解析失败。
  const mode = /^application\/(?:[\w.-]+\+)?json$/.test(contentType) ? "json" : declaredMode;
  if (mode === "blob") return response.blob();

  const rawBody = await response.text();
  if (mode === "text") return rawBody;
  if (!rawBody) return emptyBody;
  try {
    return JSON.parse(rawBody);
  } catch (cause) {
    throw new ResponseDecodeError(response, rawBody, cause);
  }
}
