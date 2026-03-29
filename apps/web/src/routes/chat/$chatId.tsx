import { createRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { ChatEmptyState } from '../../components/chat/chat-empty-state';
import { ChatHeader } from '../../components/chat/chat-header';
import { MessageList } from '../../components/chat/message-list';
import { useChatDetailQuery, useModelsQuery } from '../../features/chats/hooks';
import { PromptComposer } from '../../features/composer/prompt-composer';
import { useChatShellStore } from '../../store/ui/chat-shell-store';

import { rootRoute } from '../__root';

const ChatRouteScreen = () => {
  const { chatId } = chatRoute.useParams();
  const chatQuery = useChatDetailQuery(chatId);
  const modelsQuery = useModelsQuery();
  const consumePendingPrompt = useChatShellStore((state) => state.consumePendingPrompt);
  const appendLocalMessage = useChatShellStore((state) => state.appendLocalMessage);
  const localMessages = useChatShellStore((state) => state.localMessages[chatId] ?? []);

  useEffect(() => {
    consumePendingPrompt(chatId);
  }, [chatId, consumePendingPrompt]);

  if (chatQuery.isLoading || !chatQuery.data) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-10 text-sm text-slate-500">
        Loading conversation...
      </div>
    );
  }

  const chat = chatQuery.data;
  const modelLabel =
    modelsQuery.data?.find((model) => model.id === chat.settings.modelId)?.label ??
    chat.settings.modelId;
  const messages = [...chat.messages, ...localMessages];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader modelLabel={modelLabel} title={chat.title} />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length ? (
            <div className="mx-auto max-w-[840px] px-4 py-8 md:px-6">
              <MessageList messages={messages} />
            </div>
          ) : (
            <ChatEmptyState
              modelLabel={modelLabel}
              onPromptSelect={(prompt) => {
                appendLocalMessage(chatId, prompt);
              }}
            />
          )}
        </div>

        <div className="border-t border-slate-900/80 bg-[rgba(2,6,23,0.82)] px-4 py-4 backdrop-blur md:px-6">
          <div className="mx-auto max-w-[840px]">
            <PromptComposer
              chatId={chatId}
              onSubmit={(value) => {
                appendLocalMessage(chatId, value);
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
