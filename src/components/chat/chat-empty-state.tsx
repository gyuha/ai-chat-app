import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ChatEmptyState() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <div className="rounded-full border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--color-panel))] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
        모델 연결 대기
      </div>
      <h2 className="mt-6 text-[28px] leading-[1.15] font-semibold text-[var(--color-text)]">
        첫 대화를 시작해 보세요
      </h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
        좌측 목록에서 새 대화를 열고 모델을 선택하면 바로 대화를 시작할 수
        있습니다.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 rounded-2xl px-5 text-sm font-medium">
          <Link preload="intent" to="/">
            새 대화 시작
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          className="h-11 rounded-2xl border-[var(--color-border)] bg-[var(--color-panel)] px-5 text-sm text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
          variant="outline"
        >
          <Link preload="intent" to="/settings">
            설정 보기
          </Link>
        </Button>
      </div>
    </div>
  );
}
