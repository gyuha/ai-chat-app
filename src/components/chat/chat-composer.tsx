import { SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ChatComposerProps = {
  disabled?: boolean;
  helperText?: string;
};

export function ChatComposer({
  disabled = false,
  helperText,
}: ChatComposerProps) {
  const [draft, setDraft] = useState('');
  const placeholder = disabled
    ? '상단에서 모델을 선택하면 입력할 수 있습니다.'
    : 'OpenRouter 무료 모델에게 무엇을 물어볼까요?';

  return (
    <div className="border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_78%,var(--color-panel))]/96 px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            <Textarea
              className="min-h-[88px] max-h-[152px] resize-none rounded-2xl border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_86%,black)] px-4 py-3 text-base leading-7 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              disabled={disabled}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={placeholder}
              rows={2}
              value={draft}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">
                {helperText}
              </p>

              <Button
                className="h-10 rounded-2xl px-4 text-sm font-medium"
                disabled={disabled || draft.trim().length === 0}
              >
                <SendHorizonalIcon className="size-4" />
                전송
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
