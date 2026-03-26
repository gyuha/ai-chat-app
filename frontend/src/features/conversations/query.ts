import { queryOptions } from "@tanstack/react-query";

import { createConversation, getConversation, listConversations } from "./api";

export const conversationsQueryKey = ["conversations"] as const;

export function conversationsQueryOptions() {
  return queryOptions({
    queryKey: conversationsQueryKey,
    queryFn: listConversations,
  });
}

export function conversationDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: [...conversationsQueryKey, id] as const,
    queryFn: () => getConversation(id),
    enabled: id.length > 0,
  });
}

export function bootstrapConversationMutation() {
  return {
    mutationFn: () => createConversation({ mode: "bootstrap" }),
  };
}
