import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$conversationId")({
  component: () => (
    <div className="flex-1 flex items-center justify-center">
      채팅 영역 (Phase 2 구현)
    </div>
  ),
});
