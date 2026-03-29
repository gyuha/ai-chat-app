import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat } from '../lib/api/types';
import { chatApi } from '../lib/api/chat';

interface ChatListState {
  // 상태
  chats: Chat[];
  isLoading: boolean;
  error: string | null;

  // 액션
  loadChats: () => Promise<void>;
  createChat: (systemPrompt?: string) => Promise<Chat>;
  deleteChat: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useChatListStore = create<ChatListState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      chats: [],
      isLoading: false,
      error: null,

      // 액션
      loadChats: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await chatApi.getChats();
          set({ chats: data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createChat: async (systemPrompt?: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await chatApi.createChat(systemPrompt);
          set((state) => ({
            chats: [data, ...state.chats],
            isLoading: false,
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteChat: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await chatApi.deleteChat(id);
          set((state) => ({
            chats: state.chats.filter((c) => c.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      setError: (error) => set({ error }),
    }),
    {
      name: 'chatlist-storage',
    },
  ),
);
