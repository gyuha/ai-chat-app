import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOrReuseDraftConversation,
  getConversationById,
  listConversations,
  updateConversationMetadata,
  updateConversationModel,
} from '@/lib/conversation-service';

export const conversationsQueryKey = ['conversations'] as const;

export function getConversationQueryKey(conversationId: string) {
  return [...conversationsQueryKey, conversationId] as const;
}

export function useConversationsQuery() {
  return useQuery({
    queryFn: listConversations,
    queryKey: conversationsQueryKey,
  });
}

export function useConversationQuery(
  conversationId: string | null | undefined,
) {
  return useQuery({
    enabled: Boolean(conversationId),
    queryFn: async () => {
      if (!conversationId) {
        return null;
      }

      return getConversationById(conversationId);
    },
    queryKey: getConversationQueryKey(conversationId ?? 'missing'),
  });
}

export function useConversationActions() {
  const queryClient = useQueryClient();

  async function syncConversation(conversationId: string) {
    const [conversation, conversations] = await Promise.all([
      getConversationById(conversationId),
      listConversations(),
    ]);

    queryClient.setQueryData(conversationsQueryKey, conversations);
    queryClient.setQueryData(
      getConversationQueryKey(conversationId),
      conversation,
    );

    return conversation;
  }

  return {
    createOrReuseDraftConversation: async () => {
      const conversation = await createOrReuseDraftConversation();
      const conversations = await listConversations();

      queryClient.setQueryData(conversationsQueryKey, conversations);
      queryClient.setQueryData(
        getConversationQueryKey(conversation.id),
        conversation,
      );

      return conversation;
    },
    refreshConversation: syncConversation,
    updateConversationMetadata: async (
      conversationId: string,
      patch: Parameters<typeof updateConversationMetadata>[1],
    ) => {
      await updateConversationMetadata(conversationId, patch);

      return syncConversation(conversationId);
    },
    updateConversationModel: async (
      conversationId: string,
      modelId: string | null,
    ) => {
      await updateConversationModel(conversationId, modelId);

      return syncConversation(conversationId);
    },
  };
}
