import type { ChatMessage } from '@repo/contracts';
import { create } from 'zustand';

interface ChatShellState {
  drafts: Record<string, string>;
  localMessages: Record<string, ChatMessage[]>;
  pendingPrompt: string | null;
  setDraft: (chatId: string, value: string) => void;
  queuePrompt: (prompt: string | null) => void;
  consumePendingPrompt: (chatId: string) => void;
  appendLocalMessage: (chatId: string, content: string) => void;
}

const createMessageId = () => crypto.randomUUID();

export const useChatShellStore = create<ChatShellState>((set) => ({
  drafts: {},
  localMessages: {},
  pendingPrompt: null,
  setDraft: (chatId, value) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [chatId]: value,
      },
    })),
  queuePrompt: (prompt) => set({ pendingPrompt: prompt }),
  consumePendingPrompt: (chatId) =>
    set((state) => {
      if (!state.pendingPrompt) {
        return state;
      }

      const existingDraft = state.drafts[chatId];
      if (existingDraft?.trim()) {
        return {
          pendingPrompt: null,
        };
      }

      return {
        drafts: {
          ...state.drafts,
          [chatId]: state.pendingPrompt,
        },
        pendingPrompt: null,
      };
    }),
  appendLocalMessage: (chatId, content) =>
    set((state) => ({
      localMessages: {
        ...state.localMessages,
        [chatId]: [
          ...(state.localMessages[chatId] ?? []),
          {
            id: createMessageId(),
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
            status: 'complete',
          },
        ],
      },
    })),
}));
