import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-panel)] px-8 py-10">
        <p className="text-sm text-[var(--color-text-muted)]">/settings</p>
        <h1 className="mt-4 text-2xl font-semibold">
          설정 화면 골격을 준비했습니다.
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
          API 키, 기본 모델, 시스템 프롬프트, 테마 설정 UI는 다음 wave에서 이
          라우트 안에 배치됩니다.
        </p>
      </section>
    </main>
  );
}
