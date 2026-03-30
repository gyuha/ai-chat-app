import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatConversationRoute,
});

function ChatConversationRoute() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-panel)] px-8 py-10">
        <p className="text-sm text-[var(--color-text-muted)]">
          /chat/$conversationId
        </p>
        <h1 className="mt-4 text-2xl font-semibold">
          대화 화면 골격을 준비하고 있습니다.
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
          다음 wave에서 실제 앱 셸과 메시지 영역, 입력창이 이 경로 안에
          연결됩니다.
        </p>
      </section>
    </main>
  );
}
