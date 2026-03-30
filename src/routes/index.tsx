import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex-1 flex items-center justify-center">
      대화를 선택하거나 새 대화를 시작하세요.
    </div>
  ),
});
