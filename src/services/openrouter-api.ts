import type { Message } from "@/db";

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
}

export async function streamChatCompletion(
  apiKey: string,
  modelId: string,
  messages: Pick<Message, "role" | "content">[],
  systemPrompt: string | null,
  signal: AbortSignal,
  callbacks: StreamCallbacks,
): Promise<void> {
  const apiMessages: { role: string; content: string }[] = [];
  if (systemPrompt) {
    apiMessages.push({ role: "system", content: systemPrompt });
  }
  apiMessages.push(...messages);

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: apiMessages,
        stream: true,
      }),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return;
    }
    throw err;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `API 오류 (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      errorMessage = parsed.error?.message ?? errorMessage;
    } catch {
      /* JSON 파싱 실패 시 기본 메시지 사용 */
    }

    const error = new Error(errorMessage) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error(
      "ReadableStream을 지원하지 않는 브라우저입니다.",
    );
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let fullContent = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE 라인 단위 파싱
      const lines = buffer.split("\n");
      // 마지막 요소는 불완전할 수 있으므로 버퍼에 유지
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) continue; // 빈 줄, 주석 무시
        if (!trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6); // "data: " 제거
        if (data === "[DONE]") {
          callbacks.onComplete(fullContent);
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) {
            fullContent += delta.content;
            callbacks.onToken(delta.content);
          }
        } catch {
          // 파싱 실패 시 스킵 (불완전한 청크 가능성)
        }
      }
    }

    // 스트림이 [DONE] 없이 종료된 경우
    if (fullContent) {
      callbacks.onComplete(fullContent);
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      // 사용자가 중단한 경우
      if (fullContent) {
        callbacks.onComplete(fullContent);
      }
      return;
    }
    callbacks.onError(err as Error);
  }
}

export async function fetchFreeModels() {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  if (!response.ok) {
    throw new Error("모델 목록을 불러올 수 없습니다.");
  }
  const data = await response.json();

  return data.data
    .filter((model: Record<string, unknown>) => {
      const pricing = model.pricing as
        | Record<string, string>
        | undefined;
      return pricing?.prompt === "0" && pricing?.completion === "0";
    })
    .map((model: Record<string, unknown>) => ({
      id: model.id as string,
      name: (model.name as string) || (model.id as string),
      contextLength: model.context_length as number | undefined,
      description: model.description as string | undefined,
    }))
    .sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
    );
}
