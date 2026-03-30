import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-panel)] px-8 py-10">
        <p className="text-sm text-[var(--color-text-muted)]">
          OpenRouter Chat
        </p>
        <h1 className="mt-4 text-2xl font-semibold">
          앱 셸 라우트 구조를 준비했습니다.
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
          Phase 1의 다음 단계에서 한국어 빈 상태와 API 키 온보딩 카드가 여기에
          연결됩니다.
        </p>
      </section>
    </main>
  );
}
