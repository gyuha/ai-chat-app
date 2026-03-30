import { KeyRoundIcon, ShieldCheckIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ApiKeyOnboardingCardProps = {
  errorMessage?: string;
};

export function ApiKeyOnboardingCard({
  errorMessage,
}: ApiKeyOnboardingCardProps) {
  return (
    <section className="w-full max-w-2xl rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--color-panel))]">
          <KeyRoundIcon className="size-5 text-[var(--color-accent)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            시작 전 설정
          </p>
          <h2 className="pt-1 text-xl font-semibold text-[var(--color-text)]">
            OpenRouter API 키를 입력해 주세요
          </h2>
        </div>
      </div>

      <p className="mt-5 text-base leading-7 text-[var(--color-text-muted)]">
        브라우저에서 직접 OpenRouter API를 호출합니다. 입력한 키와 설정은
        로컬에만 저장되며, 모델 목록을 불러와 유효성을 확인한 뒤 채팅을 시작할
        수 있습니다.
      </p>

      <div className="mt-7 space-y-3">
        <label
          className="block text-sm font-medium text-[var(--color-text)]"
          htmlFor="openrouter-api-key"
        >
          OpenRouter API Key
        </label>
        <Input
          autoComplete="off"
          className="h-12 rounded-2xl border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_86%,black)] px-4 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
          id="openrouter-api-key"
          placeholder="sk-or-v1-..."
          type="password"
        />
        <div
          aria-live="polite"
          className="min-h-6 text-sm text-[var(--color-text-muted)]"
          role="status"
        >
          {errorMessage ??
            '설정 화면에서도 언제든 API 키를 변경하거나 삭제할 수 있습니다.'}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button className="h-11 rounded-2xl px-5 text-sm font-medium">
          모델 목록 확인
        </Button>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <ShieldCheckIcon className="size-4 text-[var(--color-accent)]" />
          <span>키는 IndexedDB에 로컬 저장됩니다.</span>
        </div>
      </div>
    </section>
  );
}
