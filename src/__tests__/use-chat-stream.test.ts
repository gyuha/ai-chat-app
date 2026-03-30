import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock the dependencies
vi.mock("@/hooks/use-settings", () => ({
  useSetting: vi.fn(),
  SETTINGS_KEYS: {
    API_KEY: "apiKey",
    DEFAULT_MODEL_ID: "defaultModelId",
    SYSTEM_PROMPT: "systemPrompt",
  },
}));

vi.mock("@/services/openrouter-api", () => ({
  streamChatCompletion: vi.fn(),
}));

import { useSetting } from "@/hooks/use-settings";
import { streamChatCompletion } from "@/services/openrouter-api";
import { useChatStream } from "../hooks/use-chat-stream";

// Helper to create mock streamChatCompletion that simulates streaming
function createMockStream(fullContent: string) {
  return async (
    _apiKey: string,
    _modelId: string,
    _messages: unknown[],
    _systemPrompt: string | null,
    _signal: AbortSignal,
    callbacks: {
      onToken: (token: string) => void;
      onComplete: (fullContent: string) => void;
      onError: (error: Error) => void;
    },
  ) => {
    // Simulate token-by-token streaming
    const tokens = fullContent.split(" ");
    let accumulated = "";
    for (const token of tokens) {
      if (_signal.aborted) return;
      const tokenWithSpace = accumulated === "" ? token : ` ${token}`;
      accumulated += tokenWithSpace;
      callbacks.onToken(tokenWithSpace);
    }
    callbacks.onComplete(accumulated);
  };
}

describe("useChatStream", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set isStreaming=true during streaming and false after completion", async () => {
    vi.mocked(useSetting).mockReturnValue({
      data: "test-api-key",
      isLoading: false,
    } as ReturnType<typeof useSetting>);

    vi.mocked(streamChatCompletion).mockImplementation(
      createMockStream("Hello world"),
    );

    const { result } = renderHook(() =>
      useChatStream("model-id", null),
    );

    // Initially not streaming
    expect(result.current.isStreaming).toBe(false);

    // Start streaming
    let promise: Promise<string>;
    await act(async () => {
      promise = result.current.sendMessage([
        { role: "user", content: "Hi" },
      ]);
      // Give react a tick to update state
      await new Promise((r) => setTimeout(r, 0));
    });

    // During streaming, isStreaming should be true
    expect(result.current.isStreaming).toBe(true);

    // Wait for completion
    await act(async () => {
      await promise!;
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it("should call abort on AbortController when stopStreaming is called", async () => {
    vi.mocked(useSetting).mockReturnValue({
      data: "test-api-key",
      isLoading: false,
    } as ReturnType<typeof useSetting>);

    // Create a mock that takes a while so we can abort
    vi.mocked(streamChatCompletion).mockImplementation(
      async (
        _apiKey: string,
        _modelId: string,
        _messages: unknown[],
        _systemPrompt: string | null,
        signal: AbortSignal,
        callbacks: {
          onToken: (token: string) => void;
          onComplete: (fullContent: string) => void;
          onError: (error: Error) => void;
        },
      ) => {
        callbacks.onToken("Hello");
        // Wait for abort
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (signal.aborted) return;
        callbacks.onComplete("Hello world");
      },
    );

    const { result } = renderHook(() =>
      useChatStream("model-id", null),
    );

    await act(async () => {
      result.current.sendMessage([{ role: "user", content: "Hi" }]);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isStreaming).toBe(true);

    await act(async () => {
      result.current.stopStreaming();
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it("should throw error when API key is not set", async () => {
    vi.mocked(useSetting).mockReturnValue({
      data: null,
      isLoading: false,
    } as ReturnType<typeof useSetting>);

    const { result } = renderHook(() =>
      useChatStream("model-id", null),
    );

    await act(async () => {
      await expect(
        result.current.sendMessage([{ role: "user", content: "Hi" }]),
      ).rejects.toThrow("API 키가 설정되지 않았습니다.");
    });
  });

  it("should set error state when streaming fails", async () => {
    vi.mocked(useSetting).mockReturnValue({
      data: "test-api-key",
      isLoading: false,
    } as ReturnType<typeof useSetting>);

    const apiError = new Error("서버 오류") as Error & {
      status?: number;
    };
    apiError.status = 500;

    vi.mocked(streamChatCompletion).mockImplementation(
      async (
        _apiKey: string,
        _modelId: string,
        _messages: unknown[],
        _systemPrompt: string | null,
        _signal: AbortSignal,
        callbacks: {
          onToken: (token: string) => void;
          onComplete: (fullContent: string) => void;
          onError: (error: Error) => void;
        },
      ) => {
        callbacks.onError(apiError);
      },
    );

    const { result } = renderHook(() =>
      useChatStream("model-id", null),
    );

    await act(async () => {
      try {
        await result.current.sendMessage([
          { role: "user", content: "Hi" },
        ]);
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("서버 오류");
    expect(
      (result.current.error as Error & { status?: number })?.status,
    ).toBe(500);
    expect(result.current.isStreaming).toBe(false);
  });

  it("should not set error state for AbortError (user-initiated cancel)", async () => {
    vi.mocked(useSetting).mockReturnValue({
      data: "test-api-key",
      isLoading: false,
    } as ReturnType<typeof useSetting>);

    const abortError = new DOMException("Aborted", "AbortError");

    vi.mocked(streamChatCompletion).mockImplementation(async () => {
      throw abortError;
    });

    const { result } = renderHook(() =>
      useChatStream("model-id", null),
    );

    await act(async () => {
      try {
        await result.current.sendMessage([
          { role: "user", content: "Hi" },
        ]);
      } catch {
        // AbortError is caught internally
      }
    });

    // AbortError should NOT set error state
    expect(result.current.error).toBeNull();
    expect(result.current.isStreaming).toBe(false);
  });
});
