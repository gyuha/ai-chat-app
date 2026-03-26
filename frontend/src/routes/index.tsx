import { useEffect, useRef, useState } from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Navigate, createRoute, redirect } from "@tanstack/react-router";

import { ensureSession } from "@/features/auth/session";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  conversationsQueryKey,
  conversationsQueryOptions,
} from "@/features/conversations/query";
import { createConversation } from "@/features/conversations/api";
import type { ConversationSummary } from "@/features/conversations/types";

import { rootRoute } from "./__root";

function ProtectedHomeRoute() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const hasBootstrapped = useRef(false);
  const conversationsQuery = useQuery({
    ...conversationsQueryOptions(),
    enabled: status === "authenticated",
  });

  const conversations = (() => {
    if (conversationsQuery.data?.length) {
      return conversationsQuery.data;
    }

    return [];
  })();

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

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ??
    conversations[0] ??
    null;

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
      {selectedConversation ? <p className="auth-copy">{selectedConversation.title}</p> : null}
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
