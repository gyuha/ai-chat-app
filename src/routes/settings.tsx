import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: () => (
    <div className="flex-1 flex items-center justify-center">
      설정 페이지 (Phase 1 Plan 03 구현)
    </div>
  ),
});
