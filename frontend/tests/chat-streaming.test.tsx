import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppQueryClient } from "@/app/query-client";
import { createAppRouter } from "@/app/router";
import { clearAuthState, resetAuthState } from "@/features/auth/auth.store";

import * as authApi from "@/features/auth/api";
import * as chatApi from "@/features/chat/api";
import * as chatStream from "@/features/chat/stream";
import * as conversationsApi from "@/features/conversations/api";

vi.mock("@/features/auth/api", async () => {
  const actual = await vi.importActual<typeof import("@/features/auth/api")>("@/features/auth/api");

  return {
    ...actual,
    getSession: vi.fn(),
  };
});

vi.mock("@/features/conversations/api", async () => {
  const actual = await vi.importActual<typeof import("@/features/conversations/api")>(
    "@/features/conversations/api",
  );

  return {
    ...actual,
    listConversations: vi.fn(),
    createConversation: vi.fn(),
    getConversation: vi.fn(),
  };
});

vi.mock("@/features/chat/api", () => ({
  startChatStream: vi.fn(),
}));

vi.mock("@/features/chat/stream", () => ({
  readChatStream: vi.fn(),
}));

function renderApp(initialPath = "/") {
  const queryClient = createAppQueryClient();
  const history = createMemoryHistory({
    initialEntries: [initialPath],
  });
  const router = createAppRouter({
    history,
    queryClient,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{
          queryClient,
        }}
      />
    </QueryClientProvider>,
  );

  return {
    queryClient,
    router,
  };
}

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createConversationDetail(messages: Message[]) {
  return {
    id: "conversation-1",
    title: "새 대화",
    messages,
  };
}

async function* emitChunks(
  chunks: Array<{ type: "delta" | "done"; content?: string }>,
  onDelta?: (content: string) => void,
) {
  for (const chunk of chunks) {
    if (chunk.type === "delta" && chunk.content) {
      onDelta?.(chunk.content);
    }

    yield chunk;
  }
}

describe("chat streaming", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthState();
    vi.mocked(authApi.getSession).mockResolvedValue({
      user: { id: "user-1", email: "hello@example.com" },
    });
    vi.mocked(conversationsApi.listConversations).mockResolvedValue([
      { id: "conversation-1", title: "새 대화" },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearAuthState();
  });

  it("sends on Enter but preserves newline on Shift+Enter", async () => {
    vi.mocked(conversationsApi.getConversation).mockResolvedValue(createConversationDetail([]));
    vi.mocked(chatApi.startChatStream).mockResolvedValue({} as Response);
    vi.mocked(chatStream.readChatStream).mockReturnValue(
      emitChunks([{ type: "done" }]) as AsyncGenerator<
        {
          type: "delta" | "done";
          content?: string;
        },
        void,
        unknown
      >,
    );

    renderApp("/");

    const composer = await screen.findByRole("textbox", { name: "메시지 입력" });

    fireEvent.change(composer, { target: { value: "첫 줄" } });
    fireEvent.keyDown(composer, { key: "Enter", shiftKey: true });

    expect(chatApi.startChatStream).not.toHaveBeenCalled();

    fireEvent.change(composer, { target: { value: "보낼 메시지" } });
    fireEvent.keyDown(composer, { key: "Enter" });

    await waitFor(() => {
      expect(chatApi.startChatStream).toHaveBeenCalledWith("conversation-1", {
        content: "보낼 메시지",
      });
    });
  });

  it("keeps the input editable while disabling submit during streaming", async () => {
    vi.mocked(conversationsApi.getConversation).mockResolvedValue(createConversationDetail([]));
    vi.mocked(chatApi.startChatStream).mockResolvedValue({} as Response);

    let resolveDone = () => {};
    vi.mocked(chatStream.readChatStream).mockImplementation(
      () =>
        (async function* () {
          yield { type: "delta", content: "응답" } as const;
          await new Promise<void>((resolve) => {
            resolveDone = resolve;
          });
          yield { type: "done" } as const;
        })(),
    );

    renderApp("/");

    const composer = await screen.findByRole("textbox", { name: "메시지 입력" });
    const sendButton = await screen.findByRole("button", { name: "보내기" });

    fireEvent.change(composer, { target: { value: "첫 질문" } });
    fireEvent.keyDown(composer, { key: "Enter" });

    await waitFor(() => {
      expect(sendButton).toBeDisabled();
    });

    fireEvent.change(composer, { target: { value: "다음 질문 초안" } });

    expect(composer).not.toBeDisabled();
    expect(composer).toHaveValue("다음 질문 초안");

    fireEvent.click(sendButton);

    expect(chatApi.startChatStream).toHaveBeenCalledTimes(1);

    resolveDone();

    await waitFor(() => {
      expect(sendButton).not.toBeDisabled();
    });
  });

  it("renders assistant text incrementally before the final refresh", async () => {
    vi.mocked(conversationsApi.getConversation).mockResolvedValue(createConversationDetail([]));
    vi.mocked(chatApi.startChatStream).mockResolvedValue({} as Response);
    vi.mocked(chatStream.readChatStream).mockReturnValue(
      emitChunks(
        [
          { type: "delta", content: "안녕" },
          { type: "delta", content: "하세요" },
          { type: "done" },
        ],
        (content) => {
          if (content === "안녕") {
            expect(screen.getByText("안녕")).toBeTruthy();
          }
        },
      ) as AsyncGenerator<
        {
          type: "delta" | "done";
          content?: string;
        },
        void,
        unknown
      >,
    );
    vi.mocked(conversationsApi.getConversation)
      .mockResolvedValueOnce(createConversationDetail([]))
      .mockResolvedValueOnce(
        createConversationDetail([
          { id: "message-1", role: "user", content: "질문" },
          { id: "message-2", role: "assistant", content: "안녕하세요" },
        ]),
      );

    renderApp("/");

    const composer = await screen.findByRole("textbox", { name: "메시지 입력" });

    fireEvent.change(composer, { target: { value: "질문" } });
    fireEvent.keyDown(composer, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("안녕하세요")).toBeTruthy();
    });
  });

  it("refreshes the selected conversation into canonical persisted messages after stream completion", async () => {
    vi.mocked(chatApi.startChatStream).mockResolvedValue({} as Response);
    vi.mocked(chatStream.readChatStream).mockReturnValue(
      emitChunks([{ type: "delta", content: "임시 응답" }, { type: "done" }]) as AsyncGenerator<
        {
          type: "delta" | "done";
          content?: string;
        },
        void,
        unknown
      >,
    );
    vi.mocked(conversationsApi.getConversation)
      .mockResolvedValueOnce(createConversationDetail([]))
      .mockResolvedValueOnce(
        createConversationDetail([
          { id: "message-1", role: "user", content: "질문" },
          { id: "message-2", role: "assistant", content: "저장된 응답" },
        ]),
      );

    renderApp("/");

    const composer = await screen.findByRole("textbox", { name: "메시지 입력" });

    fireEvent.change(composer, { target: { value: "질문" } });
    fireEvent.keyDown(composer, { key: "Enter" });

    await waitFor(() => {
      expect(conversationsApi.getConversation).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.getByText("저장된 응답")).toBeTruthy();
    });
  });
});
