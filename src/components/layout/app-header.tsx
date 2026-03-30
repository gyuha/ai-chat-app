import { PanelLeftIcon } from 'lucide-react';

import { NewChatButton } from '@/components/layout/new-chat-button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';

type AppHeaderProps = {
  onOpenSidebar: () => void;
  onStartNewChat: () => void;
  title: string;
};

export function AppHeader({
  onOpenSidebar,
  onStartNewChat,
  title,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_78%,var(--color-panel))]/92 backdrop-blur-sm">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          aria-label="대화 목록 열기"
          className="size-9 rounded-xl border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)] md:hidden"
          onClick={onOpenSidebar}
          size="icon"
          variant="outline"
        >
          <PanelLeftIcon className="size-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
            OpenRouter Chat
          </p>
          <h1 className="truncate pt-1 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button
              className="h-9 rounded-xl border-[var(--color-border)] bg-[var(--color-panel)] px-3 text-sm text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
              variant="outline"
            >
              무료 모델 기준
            </Button>
          </div>
          <ThemeToggle />
          <div className="md:hidden">
            <NewChatButton mobile onNavigate={onStartNewChat} />
          </div>
        </div>
      </div>
    </header>
  );
}
