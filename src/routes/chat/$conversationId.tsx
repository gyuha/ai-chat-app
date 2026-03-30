import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/components/chat/ChatPage";

export const Route = createFileRoute("/chat/$conversationId")({
  component: ChatRouteComponent,
});

function ChatRouteComponent() {
  const { conversationId } = Route.useParams();
  return <ChatPage conversationId={conversationId} />;
}
