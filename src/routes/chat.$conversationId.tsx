import { createFileRoute } from '@tanstack/react-router';

import { ChatComposer } from '@/components/chat/chat-composer';
import { MessagePanePlaceholder } from '@/components/chat/message-pane-placeholder';
import { useConversationQuery } from '@/hooks/use-conversations-query';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatConversationRoute,
});

function ChatConversationRoute() {
  const { conversationId } = Route.useParams();
  const conversationQuery = useConversationQuery(conversationId);
  const conversation = conversationQuery.data ?? null;
  const composerDisabled = !conversation?.modelId;
  const helperText = composerDisabled
    ? '먼저 상단 헤더에서 무료 모델을 선택하면 입력창이 활성화됩니다.'
    : 'Enter로 전송하고, Shift + Enter로 줄바꿈할 수 있도록 이어질 입력창 구조입니다.';

  return (
    <div className="flex min-h-full flex-1 flex-col overflow-hidden">
      <MessagePanePlaceholder conversation={conversation} />
      <ChatComposer disabled={composerDisabled} helperText={helperText} />
    </div>
  );
}
