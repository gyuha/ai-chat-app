import { queryOptions } from "@tanstack/react-query";

import {
  createConversation,
  getConversation,
  listConversations,
} from "./api";

export const conversationsQueryKey = ["conversations"] as const;

export function conversationsQueryOptions() {
  return queryOptions({
    queryKey: conversationsQueryKey,
    queryFn: listConversations,
  });
}

export function conversationDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: [...conversationsQueryKey, id],
    queryFn: () => getConversation(id),
    enabled: Boolean(id),
  });
}

export { createConversation };
