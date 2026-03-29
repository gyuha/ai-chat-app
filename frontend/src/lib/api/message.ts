import api from './client';
import type { Message } from './types';

export const messageApi = {
  getMessages: (chatId: string, cursor?: string, limit?: number) =>
    api.get<Message[]>(`/chats/${chatId}/messages`, {
      params: { cursor, limit },
    }),
};
