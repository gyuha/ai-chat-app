import { create } from 'zustand';
import type { Chat } from '@/lib/api/chat';

interface ChatListState {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  removeChat: (chatId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatListStore = create<ChatListState>((set) => ({
  chats: [],
  isLoading: false,
  error: null,
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({
    chats: [chat, ...state.chats],
  })),
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
  })),
  removeChat: (chatId) => set((state) => ({
    chats: state.chats.filter((chat) => chat.id !== chatId),
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
