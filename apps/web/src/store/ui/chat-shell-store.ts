import type { ChatMessage, StreamMode } from '@repo/contracts';
import { create } from 'zustand';

export interface ChatStreamSession {
  mode: StreamMode;
  status: 'streaming' | 'stopped' | 'error';
  abortController: AbortController | null;
  optimisticUser?: ChatMessage;
  assistantDraft?: ChatMessage;
  replaceMessageId?: string;
  error?: string;
  liveMessage: string;
  shouldAutoScroll: boolean;
}

interface ChatShellState {
  drafts: Record<string, string>;
  pendingPrompt: string | null;
  streamSessions: Record<string, ChatStreamSession | undefined>;
  setDraft: (chatId: string, value: string) => void;
  queuePrompt: (prompt: string | null) => void;
  consumePendingPrompt: () => string | null;
  setStreamSession: (chatId: string, session: ChatStreamSession) => void;
  updateStreamSession: (
    chatId: string,
    updater: (session: ChatStreamSession) => ChatStreamSession,
  ) => void;
  clearStreamSession: (chatId: string) => void;
}

export const useChatShellStore = create<ChatShellState>((set) => ({
  drafts: {},
  pendingPrompt: null,
  streamSessions: {},
  setDraft: (chatId, value) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [chatId]: value,
      },
    })),
  queuePrompt: (prompt) => set({ pendingPrompt: prompt }),
  consumePendingPrompt: () => {
    let nextPrompt: string | null = null;

    set((state) => {
      nextPrompt = state.pendingPrompt;
      return {
        pendingPrompt: null,
      };
    });

    return nextPrompt;
  },
  setStreamSession: (chatId, session) =>
    set((state) => ({
      streamSessions: {
        ...state.streamSessions,
        [chatId]: session,
      },
    })),
  updateStreamSession: (chatId, updater) =>
    set((state) => {
      const current = state.streamSessions[chatId];
      if (!current) {
        return state;
      }

      return {
        streamSessions: {
          ...state.streamSessions,
          [chatId]: updater(current),
        },
      };
    }),
  clearStreamSession: (chatId) =>
    set((state) => {
      const next = { ...state.streamSessions };
      delete next[chatId];
      return {
        streamSessions: next,
      };
    }),
}));
