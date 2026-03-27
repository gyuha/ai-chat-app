import { create } from 'zustand';
import type { ChatMessage, Chat } from '@/lib/api/chat';

interface ChatState {
  currentChatId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  setCurrentChat: (chatId: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChatId: null,
  messages: [],
  isLoading: false,
  error: null,
  setCurrentChat: (chatId) => set({ currentChatId: chatId }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
