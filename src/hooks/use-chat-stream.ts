import { useCallback, useRef, useState } from "react";
import { streamChatCompletion } from "@/services/openrouter-api";
import type { Message } from "@/db";
import { useSetting, SETTINGS_KEYS } from "@/hooks/use-settings";

export interface UseChatStreamReturn {
  streamingContent: string;
  isStreaming: boolean;
  error: (Error & { status?: number }) | null;
  sendMessage: (
    messages: Pick<Message, "role" | "content">[],
  ) => Promise<string>;
  stopStreaming: () => void;
}

export function useChatStream(
  modelId: string,
  systemPrompt: string | null,
): UseChatStreamReturn {
  const { data: apiKey } = useSetting(SETTINGS_KEYS.API_KEY);
  const abortRef = useRef<AbortController | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<
    (Error & { status?: number }) | null
  >(null);

  const sendMessage = useCallback(
    async (
      messages: Pick<Message, "role" | "content">[],
    ): Promise<string> => {
      if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다.");
      }

      // Abort previous stream
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsStreaming(true);
      setError(null);
      setStreamingContent("");

      let fullContent = "";

      try {
        await streamChatCompletion(
          apiKey,
          modelId,
          messages,
          systemPrompt,
          controller.signal,
          {
            onToken: (token) => {
              fullContent += token;
              setStreamingContent((prev) => prev + token);
            },
            onComplete: (content) => {
              fullContent = content;
            },
            onError: (err) => {
              throw err;
            },
          },
        );
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User-initiated abort -- not an error
        } else {
          setError(err as Error & { status?: number });
          throw err;
        }
      } finally {
        setIsStreaming(false);
      }

      return fullContent;
    },
    [apiKey, modelId, systemPrompt],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  return {
    streamingContent,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
  };
}
