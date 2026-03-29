import type { ChatDetail, ChatSummary } from '@repo/contracts';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { createChat, fetchChatDetail, fetchChats, fetchModels } from '../../lib/api';
import { useChatShellStore } from '../../store/ui/chat-shell-store';

export const toChatSummary = (chat: ChatDetail): ChatSummary => ({
  id: chat.id,
  title: chat.title,
  updatedAt: chat.updatedAt,
  settings: chat.settings,
});

export const applyChatToCache = (queryClient: QueryClient, chat: ChatDetail) => {
  queryClient.setQueryData(['chat', chat.id], chat);
  queryClient.setQueryData<ChatSummary[]>(['chats'], (current = []) => [
    toChatSummary(chat),
    ...current.filter((item) => item.id !== chat.id),
  ]);
};

export const useModelsQuery = () =>
  useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
  });

export const useChatsQuery = () =>
  useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });

export const useChatDetailQuery = (chatId: string) =>
  useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChatDetail(chatId),
  });

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChat,
    onSuccess: (chat) => {
      applyChatToCache(queryClient, chat);
    },
  });
};

export const useCreateChatFlow = () => {
  const navigate = useNavigate();
  const queuePrompt = useChatShellStore((state) => state.queuePrompt);
  const createChatMutation = useCreateChatMutation();

  return async (prompt?: string) => {
    queuePrompt(prompt ?? null);
    const chat = await createChatMutation.mutateAsync(undefined);
    await navigate({
      to: '/chat/$chatId',
      params: {
        chatId: chat.id,
      },
    });
  };
};
