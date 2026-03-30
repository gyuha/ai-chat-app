import { createFileRoute } from "@tanstack/react-router";
import { useSetting, SETTINGS_KEYS } from "@/hooks/use-settings";
import { EmptyApiKeyListener } from "@/components/settings/EmptyApiKeyListener";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { data: apiKey } = useSetting(SETTINGS_KEYS.API_KEY);

  if (!apiKey) {
    return <EmptyApiKeyListener />;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold text-foreground">새 대화를 시작하세요</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        사이드바에서 새 대화 버튼을 클릭하여 채팅을 시작할 수 있습니다.
      </p>
    </div>
  );
}
