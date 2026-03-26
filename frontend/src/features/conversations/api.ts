import { apiRequest } from "@/lib/api/client";

import type { ConversationSummary, CreateConversationPayload } from "./types";

export function listConversations() {
  return apiRequest<ConversationSummary[]>("/conversations");
}

export function createConversation(payload: CreateConversationPayload = {}) {
  return apiRequest<ConversationSummary>("/conversations", {
    method: "POST",
    body: payload,
  });
}

export function getConversation(id: string) {
  return apiRequest<ConversationSummary>(`/conversations/${id}`);
}
