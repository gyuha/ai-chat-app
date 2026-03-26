import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, createRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/features/auth/auth.store";
import { ensureSession } from "@/features/auth/session";
import { startChatStream } from "@/features/chat/api";
import { readChatStream } from "@/features/chat/stream";
import { createConversation } from "@/features/conversations/api";
import {
  conversationDetailQueryOptions,
  conversationsQueryKey,
  conversationsQueryOptions,
} from "@/features/conversations/query";
import type { ConversationSummary } from "@/features/conversations/types";

import { rootRoute } from "./__root";

type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ConversationDetail = ConversationSummary & {
  messages?: ConversationMessage[];
};

function ProtectedHomeRoute() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [streamingAssistantMessage, setStreamingAssistantMessage] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const hasBootstrapped = useRef(false);
  const conversationsQuery = useQuery({
    ...conversationsQueryOptions(),
    enabled: status === "authenticated",
  });

  const conversations = conversationsQuery.data ?? [];

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      conversationsQuery.isSuccess &&
      conversations.length === 0 &&
      !hasBootstrapped.current &&
      !isBootstrapping
    ) {
      hasBootstrapped.current = true;
      setIsBootstrapping(true);

      void createConversation({ mode: "bootstrap" })
        .then((conversation) => {
          queryClient.setQueryData<ConversationSummary[]>(conversationsQueryKey, [conversation]);
          queryClient.setQueryData([...conversationsQueryKey, conversation.id], conversation);
          setSelectedConversationId(conversation.id);
        })
        .finally(() => {
          setIsBootstrapping(false);
        });
    }
  }, [conversations.length, conversationsQuery.isSuccess, isBootstrapping, queryClient, status]);

  const conversationDetailQuery = useQuery({
    ...conversationDetailQueryOptions(selectedConversationId ?? ""),
    enabled: status === "authenticated" && !!selectedConversationId,
  });

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    conversations[0] ??
    null;
  const selectedConversationDetail = conversationDetailQuery.data as ConversationDetail | undefined;
  const visibleMessages = [...(selectedConversationDetail?.messages ?? [])];

  if (pendingUserMessage) {
    visibleMessages.push({
      id: "pending-user-message",
      role: "user",
      content: pendingUserMessage,
    });
  }

  if (streamingAssistantMessage) {
    visibleMessages.push({
      id: "streaming-assistant-message",
      role: "assistant",
      content: streamingAssistantMessage,
    });
  }

  const canSend = !!selectedConversationId && draft.trim().length > 0 && !isStreaming;

  async function refreshConversation(conversationId: string) {
    await queryClient.invalidateQueries({
      queryKey: conversationsQueryKey,
    });
    await queryClient.invalidateQueries({
      queryKey: [...conversationsQueryKey, conversationId],
    });
    await queryClient.fetchQuery(conversationDetailQueryOptions(conversationId));
  }

  async function handleSubmit() {
    const conversationId = selectedConversationId;
    const content = draft.trim();

    if (!conversationId || !content || isStreaming) {
      return;
    }

    setDraft("");
    setStreamError(null);
    setPendingUserMessage(content);
    setStreamingAssistantMessage("");
    setIsStreaming(true);

    try {
      const response = await startChatStream(conversationId, {
        content,
      });

      for await (const event of readChatStream(response)) {
        if (event.type === "delta" && event.content) {
          setStreamingAssistantMessage((current) => current + event.content);
          continue;
        }

        if (event.type === "error") {
          setStreamError(event.message ?? "응답 생성 중 오류가 발생했습니다.");
          await refreshConversation(conversationId);
          setPendingUserMessage(null);
          setStreamingAssistantMessage("");
          setIsStreaming(false);
          return;
        }

        if (event.type === "done") {
          await refreshConversation(conversationId);
          setPendingUserMessage(null);
          setStreamingAssistantMessage("");
          setIsStreaming(false);
          return;
        }
      }

      await refreshConversation(conversationId);
      setPendingUserMessage(null);
      setStreamingAssistantMessage("");
      setIsStreaming(false);
    } catch (error) {
      setStreamError(error instanceof Error ? error.message : "메시지 전송에 실패했습니다.");
      await refreshConversation(conversationId);
      setPendingUserMessage(null);
      setStreamingAssistantMessage("");
      setIsStreaming(false);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  if (status === "anonymous") {
    return <Navigate to="/login" />;
  }

  return (
    <section className="app-home-card auth-card">
      <p className="eyebrow">Conversations</p>
      {user ? <p className="auth-copy">{user.email} 계정으로 인증되었습니다.</p> : null}
      <div className="auth-actions">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversation?.id;

          return (
            <button
              className={isSelected ? "primary-action" : "secondary-action"}
              key={conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              type="button"
            >
              {conversation.title}
            </button>
          );
        })}
        {!selectedConversation && (conversationsQuery.isPending || isBootstrapping) ? (
          <p className="auth-copy">대화를 준비하는 중입니다.</p>
        ) : null}
      </div>
      {selectedConversation ? (
        <>
          <p className="auth-copy">{selectedConversation.title}</p>
          <div aria-label="메시지 목록">
            {visibleMessages.length === 0 ? (
              <p className="auth-copy">아직 메시지가 없습니다.</p>
            ) : (
              visibleMessages.map((message) => (
                <article key={message.id}>
                  <p className="eyebrow">{message.role === "user" ? "You" : "Assistant"}</p>
                  <p>{message.content}</p>
                </article>
              ))
            )}
          </div>
          {streamError ? <p className="auth-copy">{streamError}</p> : null}
          {conversationDetailQuery.isPending ? (
            <p className="auth-copy">대화 내용을 불러오는 중입니다.</p>
          ) : null}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <label className="eyebrow" htmlFor="chat-composer">
              메시지 입력
            </label>
            <textarea
              id="chat-composer"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              rows={4}
              value={draft}
            />
            <div className="auth-actions">
              <button disabled={!canSend} type="submit">
                보내기
              </button>
            </div>
          </form>
        </>
      ) : null}
    </section>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async ({ context }) => {
    const user = await ensureSession(context.queryClient);

    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedHomeRoute,
});
