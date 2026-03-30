export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 py-16 text-[var(--color-text)]">
      <div className="w-full max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-panel)] px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <span className="inline-flex rounded-full border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text-muted)]">
          OpenRouter Chat
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          한국어 AI 채팅 셸을 준비하고 있습니다.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
          Phase 1에서는 ChatGPT 스타일의 반응형 레이아웃, 다크 기본 테마,
          사이드바와 빈 상태 구조를 먼저 고정합니다.
        </p>
      </div>
    </main>
  );
}
