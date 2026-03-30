import { createFileRoute } from '@tanstack/react-router';

import { ChatComposer } from '@/components/chat/chat-composer';
import { MessagePanePlaceholder } from '@/components/chat/message-pane-placeholder';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatConversationRoute,
});

function ChatConversationRoute() {
  const { conversationId } = Route.useParams();

  return (
    <div className="flex min-h-full flex-1 flex-col overflow-hidden">
      <MessagePanePlaceholder conversationId={conversationId} />
      <ChatComposer />
    </div>
  );
}
