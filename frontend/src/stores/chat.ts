import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat, Message } from '../lib/api/types';
import { streamMessage } from '../lib/api/streaming';

interface ChatState {
  // 상태
  currentChat: Chat | null;
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  error: string | null;
  abortController: AbortController | null;

  // 액션
  setCurrentChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  startStreaming: () => void;
  updateStreamingContent: (content: string) => void;
  stopStreaming: () => void;
  clearStreaming: () => void;
  setError: (error: string | null) => void;
  sendMessage: (content: string) => Promise<void>;
  regenerateLast: () => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      currentChat: null,
      messages: [],
      streamingContent: '',
      isStreaming: false,
      error: null,
      abortController: null,

      // 액션
      setCurrentChat: (chat) => set({ currentChat: chat }),

      setMessages: (messages) => set({ messages }),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      startStreaming: () =>
        set({
          isStreaming: true,
          streamingContent: '',
          error: null,
          abortController: new AbortController(),
        }),

      updateStreamingContent: (content) =>
        set({ streamingContent: content }),

      stopStreaming: () => {
        const controller = get().abortController;
        if (controller) {
          controller.abort();
        }
        set({
          isStreaming: false,
          abortController: null,
        });
      },

      clearStreaming: () =>
        set({
          streamingContent: '',
          isStreaming: false,
          abortController: null,
          error: null,
        }),

      setError: (error) => set({ error }),

      sendMessage: async (content: string) => {
        const { currentChat, startStreaming, updateStreamingContent, clearStreaming, setError, abortController } = get();

        if (!currentChat) {
          setError('No active chat');
          return;
        }

        startStreaming();

        try {
          await streamMessage(currentChat.id, content, {
            signal: abortController?.signal,
            onChunk: (chunk) => {
              set((state) => ({
                streamingContent: state.streamingContent + chunk,
              }));
            },
            onComplete: () => {
              clearStreaming();
              // 메시지 목록 새로고침 트리거
              window.dispatchEvent(new CustomEvent('messages-refresh'));
            },
            onError: (error) => {
              setError(error);
              clearStreaming();
            },
          });
        } catch (error: any) {
          setError(error.message);
          clearStreaming();
        }
      },

      regenerateLast: async () => {
        const { messages, currentChat, startStreaming, clearStreaming, setError } = get();

        if (!currentChat || messages.length === 0) {
          setError('Cannot regenerate: no messages');
          return;
        }

        // 마지막 사용자 메시지 찾기
        const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

        if (!lastUserMessage) {
          setError('Cannot regenerate: no user message');
          return;
        }

        startStreaming();

        try {
          await streamMessage(currentChat.id, lastUserMessage.content, {
            onChunk: (chunk) => {
              set((state) => ({
                streamingContent: state.streamingContent + chunk,
              }));
            },
            onComplete: () => {
              clearStreaming();
              window.dispatchEvent(new CustomEvent('messages-refresh'));
            },
            onError: (error) => {
              setError(error);
              clearStreaming();
            },
          });
        } catch (error: any) {
          setError(error.message);
          clearStreaming();
        }
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        currentChat: state.currentChat,
        // messages는 persist에서 제외 (너무 큼)
        // streaming 상태는 persist에서 제외
      }),
    },
  ),
);
