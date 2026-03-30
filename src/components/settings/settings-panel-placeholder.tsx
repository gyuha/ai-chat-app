import { PaletteIcon, SlidersHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  selectThemePreference,
  type ThemePreference,
  useUiStore,
} from '@/stores/ui-store';

const themeOptions: Array<{
  description: string;
  label: string;
  value: ThemePreference;
}> = [
  {
    description: '기본 권장값',
    label: '다크',
    value: 'dark',
  },
  {
    description: '밝은 테마',
    label: '라이트',
    value: 'light',
  },
  {
    description: '시스템 따름',
    label: '시스템',
    value: 'system',
  },
];

export function SettingsPanelPlaceholder() {
  const themePreference = useUiStore(selectThemePreference);
  const setThemePreference = useUiStore((state) => state.setThemePreference);

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <Panel
          description="브라우저에 저장된 키로 모델 목록을 불러와 검증합니다."
          title="API 키 관리"
        >
          <div className="grid gap-3">
            <Input
              className="h-12 rounded-2xl border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_86%,black)] px-4 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              placeholder="sk-or-v1-..."
              type="password"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="h-11 rounded-2xl px-5 text-sm font-medium">
                키 확인하기
              </Button>
              <Button
                className="h-11 rounded-2xl border-[var(--color-border)] bg-transparent px-5 text-sm text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
                variant="outline"
              >
                삭제
              </Button>
            </div>
          </div>
        </Panel>

        <Panel
          description="무료 모델만 필터링해 기본 모델로 저장할 준비를 합니다."
          title="기본 모델"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 justify-between rounded-2xl border-[var(--color-border)] bg-transparent px-4 text-sm text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
              variant="outline"
            >
              무료 모델 선택
              <SlidersHorizontalIcon className="size-4 text-[var(--color-text-muted)]" />
            </Button>
            <div className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
              기본값은 아직 선택되지 않았습니다.
            </div>
          </div>
        </Panel>

        <Panel
          description="전역 시스템 프롬프트는 모든 새 대화의 기본값으로 사용됩니다."
          title="시스템 프롬프트"
        >
          <Textarea
            className="min-h-32 rounded-2xl border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_86%,black)] px-4 py-3 text-base leading-7 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            placeholder="예: 모든 답변은 한국어로 간결하게 작성해 주세요."
          />
        </Panel>

        <Panel
          description="시스템 기본값은 다크 모드이며, 수동 전환도 가능합니다."
          title="테마"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                className="h-auto min-h-20 flex-col items-start rounded-2xl border-[var(--color-border)] px-4 py-4 text-left hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
                onClick={() => setThemePreference(option.value)}
                variant={
                  themePreference === option.value ? 'default' : 'outline'
                }
              >
                <div className="flex items-center gap-2">
                  <PaletteIcon className="size-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <span className="pt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {option.description}
                </span>
              </Button>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

type PanelProps = {
  children: React.ReactNode;
  description: string;
  title: string;
};

function Panel({ children, description, title }: PanelProps) {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-5 sm:px-6">
      <div className="pb-5">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          {title}
        </h2>
        <p className="pt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
