import type { ChatDetail, ChatMessage, StreamEvent } from '@repo/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { createRoute } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useRef } from 'react';

import { ChatEmptyState } from '../../components/chat/chat-empty-state';
import { ChatHeader } from '../../components/chat/chat-header';
import { MessageList } from '../../components/chat/message-list';
import { applyChatToCache, useChatDetailQuery, useModelsQuery } from '../../features/chats/hooks';
import { buildDisplayedMessages } from '../../features/chats/stream-state';
import { PromptComposer } from '../../features/composer/prompt-composer';
import { fetchChatDetail, streamChatMessage, streamRegenerateMessage } from '../../lib/api';
import { useChatShellStore } from '../../store/ui/chat-shell-store';

import { rootRoute } from '../__root';

const createMessage = (
  role: ChatMessage['role'],
  content: string,
  status: ChatMessage['status'],
  id: string = crypto.randomUUID(),
): ChatMessage => ({
  id,
  role,
  content,
  createdAt: new Date().toISOString(),
  status,
});

const findLatestAssistantMessageId = (messages: ChatMessage[]) =>
  [...messages].reverse().find((message) => message.role === 'assistant')?.id;

const ChatRouteScreen = () => {
  const { chatId } = chatRoute.useParams();
  const queryClient = useQueryClient();
  const chatQuery = useChatDetailQuery(chatId);
  const modelsQuery = useModelsQuery();
  const consumePendingPrompt = useChatShellStore((state) => state.consumePendingPrompt);
  const clearStreamSession = useChatShellStore((state) => state.clearStreamSession);
  const setStreamSession = useChatShellStore((state) => state.setStreamSession);
  const streamSession = useChatShellStore((state) => state.streamSessions[chatId]);
  const updateStreamSession = useChatShellStore((state) => state.updateStreamSession);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const chat = chatQuery.data;
  const messages = chat
    ? buildDisplayedMessages(chat, {
        mode: streamSession?.mode,
        optimisticUser: streamSession?.optimisticUser,
        assistantDraft: streamSession?.assistantDraft,
        replaceMessageId: streamSession?.replaceMessageId,
      })
    : [];

  const syncChat = useEffectEvent(async (chat: ChatDetail) => {
    applyChatToCache(queryClient, chat);
  });

  const refetchChat = useEffectEvent(async () => {
    const refreshed = await fetchChatDetail(chatId);
    applyChatToCache(queryClient, refreshed);
    return refreshed;
  });

  const finalizeAbortedSession = useEffectEvent(async () => {
    await refetchChat();
    clearStreamSession(chatId);
  });

  const scrollToBottom = useEffectEvent(() => {
    if (!useChatShellStore.getState().streamSessions[chatId]?.shouldAutoScroll) {
      return;
    }

    scrollAnchorRef.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  });

  const handleStreamEvent = useEffectEvent(async (event: StreamEvent) => {
    switch (event.event) {
      case 'meta':
        updateStreamSession(chatId, (session) => ({
          ...session,
          liveMessage: event.data.mode === 'regenerate' ? '응답 재생성 중' : '응답 생성 중',
        }));
        break;
      case 'message:start':
        updateStreamSession(chatId, (session) => ({
          ...session,
          replaceMessageId: event.data.replaceMessageId,
          assistantDraft: {
            ...(session.assistantDraft ??
              createMessage('assistant', '', 'streaming', event.data.messageId)),
            id: event.data.messageId,
            status: 'streaming',
          },
        }));
        scrollToBottom();
        break;
      case 'message:delta':
        updateStreamSession(chatId, (session) => ({
          ...session,
          assistantDraft: {
            ...(session.assistantDraft ??
              createMessage('assistant', '', 'streaming', event.data.messageId)),
            id: event.data.messageId,
            content: event.data.content,
            status: 'streaming',
          },
        }));
        scrollToBottom();
        break;
      case 'message:done':
        await syncChat(event.data.chat);
        clearStreamSession(chatId);
        scrollToBottom();
        break;
      case 'error':
        updateStreamSession(chatId, (session) => ({
          ...session,
          optimisticUser: undefined,
          assistantDraft: undefined,
          abortController: null,
          error: event.data.message,
          liveMessage: event.data.message,
          status: 'error',
        }));
        await refetchChat();
        break;
      case 'heartbeat':
        break;
    }
  });

  const runStream = useEffectEvent(
    async ({
      mode,
      optimisticUser,
      replaceMessageId,
      stream,
    }: {
      mode: 'message' | 'regenerate';
      optimisticUser?: ChatMessage;
      replaceMessageId?: string;
      stream: AsyncGenerator<StreamEvent>;
    }) => {
      try {
        for await (const event of stream) {
          await handleStreamEvent(event);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          updateStreamSession(chatId, (session) => ({
            ...session,
            abortController: null,
            liveMessage: '응답 중단됨',
            status: 'stopped',
            assistantDraft: session.assistantDraft
              ? {
                  ...session.assistantDraft,
                  status: 'stopped',
                }
              : session.assistantDraft,
          }));
          await finalizeAbortedSession();
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : '응답 생성 중 문제가 발생했습니다. 다시 시도해 주세요.';
        updateStreamSession(chatId, (session) => ({
          ...session,
          abortController: null,
          optimisticUser: mode === 'message' ? optimisticUser : undefined,
          replaceMessageId,
          error: message,
          liveMessage: message,
          status: 'error',
        }));
        await refetchChat();
      }
    },
  );

  const startMessageStream = useEffectEvent(async (prompt: string) => {
    if (!chatQuery.data || streamSession?.status === 'streaming') {
      return;
    }

    const abortController = new AbortController();
    const optimisticUser = createMessage('user', prompt, 'complete');
    const assistantDraft = createMessage('assistant', '', 'streaming');

    setStreamSession(chatId, {
      mode: 'message',
      status: 'streaming',
      abortController,
      optimisticUser,
      assistantDraft,
      liveMessage: '응답 생성 중',
      shouldAutoScroll: true,
    });

    void runStream({
      mode: 'message',
      optimisticUser,
      stream: streamChatMessage(chatId, { prompt }, abortController.signal),
    });
  });

  const startRegenerateStream = useEffectEvent(async () => {
    if (!chatQuery.data || streamSession?.status === 'streaming') {
      return;
    }

    const replaceMessageId = findLatestAssistantMessageId(chatQuery.data.messages);
    if (!replaceMessageId) {
      return;
    }

    const abortController = new AbortController();
    setStreamSession(chatId, {
      mode: 'regenerate',
      status: 'streaming',
      abortController,
      replaceMessageId,
      assistantDraft: createMessage('assistant', '', 'streaming'),
      liveMessage: '응답 재생성 중',
      shouldAutoScroll: true,
    });

    void runStream({
      mode: 'regenerate',
      replaceMessageId,
      stream: streamRegenerateMessage(chatId, abortController.signal),
    });
  });

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const nextPrompt = consumePendingPrompt();
    if (nextPrompt) {
      void startMessageStream(nextPrompt);
    }
  }, [chatId, consumePendingPrompt]);

  if (chatQuery.isLoading || !chat) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-10 text-sm text-slate-500">
        Loading conversation...
      </div>
    );
  }

  const modelLabel =
    modelsQuery.data?.find((model) => model.id === chat.settings.modelId)?.label ??
    chat.settings.modelId;
  const latestAssistantMessageId = findLatestAssistantMessageId(messages);
  const visibleStatus =
    streamSession?.status === 'streaming'
      ? streamSession.mode === 'regenerate'
        ? 'Regenerating'
        : 'Streaming'
      : streamSession?.status === 'error'
        ? 'Needs retry'
        : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader modelLabel={modelLabel} statusLabel={visibleStatus} title={chat.title} />

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="flex-1 overflow-y-auto"
          onScroll={(event) => {
            const element = event.currentTarget;
            const nearBottom =
              element.scrollHeight - element.scrollTop - element.clientHeight <= 120;

            if (streamSession) {
              updateStreamSession(chatId, (session) => ({
                ...session,
                shouldAutoScroll: nearBottom,
              }));
            }
          }}
        >
          <div aria-live="polite" className="sr-only">
            {streamSession?.liveMessage ?? '대화 준비 완료'}
          </div>
          {messages.length ? (
            <div className="mx-auto max-w-[840px] px-4 py-8 md:px-6">
              {streamSession?.error ? (
                <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {streamSession.error}
                </div>
              ) : null}
              <MessageList
                isStreaming={streamSession?.status === 'streaming'}
                messages={messages}
                onRegenerate={() => {
                  void startRegenerateStream();
                }}
                regenerateMessageId={latestAssistantMessageId}
              />
              <div ref={scrollAnchorRef} />
            </div>
          ) : (
            <ChatEmptyState
              modelLabel={modelLabel}
              onPromptSelect={(prompt) => {
                void startMessageStream(prompt);
              }}
            />
          )}
        </div>

        <div className="border-t border-slate-900/80 bg-[rgba(2,6,23,0.82)] px-4 py-4 backdrop-blur md:px-6">
          <div className="mx-auto max-w-[840px]">
            <PromptComposer
              chatId={chatId}
              isStreaming={streamSession?.status === 'streaming'}
              onAbort={() => {
                streamSession?.abortController?.abort();
              }}
              onSubmit={(value) => {
                void startMessageStream(value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$chatId',
  component: ChatRouteScreen,
});
