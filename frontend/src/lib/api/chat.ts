import api from './client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export interface ChatDetail {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  message: string;
  chatId?: string;
  model?: string;
}

export interface SendMessageResponse {
  chatId: string;
  message: ChatMessage;
}

export const chatApi = {
  getChats: async () => {
    const response = await api.get<Chat[]>('/chat');
    return response.data;
  },

  getChat: async (chatId: string) => {
    const response = await api.get<ChatDetail>(`/chat/${chatId}`);
    return response.data;
  },

  sendMessage: async (data: SendMessageRequest) => {
    const response = await api.post<SendMessageResponse>('/chat', data);
    return response.data;
  },
};
