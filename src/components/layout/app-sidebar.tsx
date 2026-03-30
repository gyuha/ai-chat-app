import { Link } from '@tanstack/react-router';
import { BoltIcon, Settings2Icon } from 'lucide-react';
import type { CSSProperties } from 'react';

import { ConversationList } from '@/components/layout/conversation-list';
import { NewChatButton } from '@/components/layout/new-chat-button';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type AppSidebarProps = {
  activeConversationId: string | null;
  currentPath: string;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function AppSidebar({
  activeConversationId,
  currentPath,
  mobileOpen,
  onMobileOpenChange,
}: AppSidebarProps) {
  const handleNavigate = () => {
    onMobileOpenChange(false);
  };

  return (
    <>
      <Sidebar
        collapsible="none"
        className="hidden border-r border-[var(--color-border)] bg-[var(--color-panel)] md:flex"
        style={{ '--sidebar-width': '17.5rem' } as CSSProperties}
      >
        <SidebarBody
          activeConversationId={activeConversationId}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      </Sidebar>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          className="w-[280px] max-w-[90vw] border-r border-[var(--color-border)] bg-[var(--color-panel)] p-0 text-[var(--color-text)]"
          side="left"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>대화 목록</SheetTitle>
          </SheetHeader>
          <SidebarBody
            activeConversationId={activeConversationId}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

type SidebarBodyProps = {
  activeConversationId: string | null;
  currentPath: string;
  onNavigate: () => void;
};

function SidebarBody({
  activeConversationId,
  currentPath,
  onNavigate,
}: SidebarBodyProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--color-panel)]">
      <SidebarHeader className="gap-4 px-3 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_16%,var(--color-panel))]">
            <BoltIcon className="size-4 text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              OpenRouter Chat
            </p>
            <p className="pt-1 text-xs text-[var(--color-text-muted)]">
              무료 모델 웹 채팅
            </p>
          </div>
        </div>

        <NewChatButton onNavigate={onNavigate} />
      </SidebarHeader>

      <SidebarSeparator className="mx-3" />

      <SidebarContent className="px-0 py-4">
        <ConversationList
          activeConversationId={activeConversationId}
          onNavigate={onNavigate}
        />
      </SidebarContent>

      <SidebarSeparator className="mx-3" />

      <SidebarFooter className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === '/settings'}
              className={cn(
                'h-11 rounded-xl px-3 text-[var(--color-text)] transition-colors duration-200',
                'hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]',
                'data-[active=true]:bg-[color-mix(in_srgb,var(--color-accent)_18%,var(--color-panel))]',
              )}
            >
              <Link preload="intent" to="/settings" onClick={onNavigate}>
                <Settings2Icon className="size-4" />
                <span>설정</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Button
          className="mt-1 h-10 justify-start rounded-xl border-[var(--color-border)] bg-transparent px-3 text-[var(--color-text-muted)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)] hover:text-[var(--color-text)]"
          variant="ghost"
        >
          현재 기준: 다크 모드 기본
        </Button>
      </SidebarFooter>
    </div>
  );
}
