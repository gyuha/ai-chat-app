import type { StreamDelta } from "./types";

export async function* readChatStream(response: Response): AsyncGenerator<StreamDelta> {
  const reader = response.body?.getReader();

  if (!reader) {
    yield {
      type: "error",
      message: "응답 스트림을 읽을 수 없습니다.",
    };
    return;
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        const remaining = decoder.decode();

        if (remaining) {
          yield {
            type: "delta",
            content: remaining,
          };
        }

        yield { type: "done" };
        return;
      }

      const content = decoder.decode(value, { stream: true });

      if (!content) {
        continue;
      }

      yield {
        type: "delta",
        content,
      };
    }
  } catch (error) {
    yield {
      type: "error",
      message: error instanceof Error ? error.message : "스트리밍 중 오류가 발생했습니다.",
    };
  }
}
