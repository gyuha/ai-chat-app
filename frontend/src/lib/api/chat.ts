import api from './client';
import type { Chat } from './types';

export const chatApi = {
  createChat: (systemPrompt?: string) =>
    api.post<Chat>('/chats', { systemPrompt }),

  getChats: () =>
    api.get<Chat[]>('/chats'),

  getChat: (id: string) =>
    api.get<Chat>(`/chats/${id}`),

  deleteChat: (id: string) =>
    api.delete(`/chats/${id}`),

  updateChat: (id: string, data: { title?: string; systemPrompt?: string }) =>
    api.put<Chat>(`/chats/${id}`, data),
};
