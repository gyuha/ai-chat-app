import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '../../lib/utils';

interface SidebarContextValue {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const value = useMemo(() => ({ mobileOpen, setMobileOpen, triggerRef }), [mobileOpen]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }

  return context;
};

export const Sidebar = ({ className, children }: PropsWithChildren<{ className?: string }>) => {
  return (
    <aside
      className={cn(
        'hidden w-[280px] border-r border-slate-900/80 bg-[var(--sidebar-bg)] px-4 py-5 md:block',
        className,
      )}
    >
      {children}
    </aside>
  );
};

export const SidebarContent = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('flex h-full flex-col gap-4', className)}>{children}</div>;
};

export const SidebarTrigger = () => {
  const { mobileOpen, setMobileOpen, triggerRef } = useSidebar();

  return (
    <button
      aria-controls="mobile-sidebar"
      aria-expanded={mobileOpen}
      aria-label="Open sidebar"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/70 text-slate-200 transition hover:border-slate-700 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      onClick={() => setMobileOpen(!mobileOpen)}
      ref={triggerRef}
      type="button"
    >
      <span className="text-lg leading-none">=</span>
    </button>
  );
};

export const SidebarMobileSheet = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { mobileOpen, setMobileOpen, triggerRef } = useSidebar();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const focusTarget = panelRef.current?.querySelector<HTMLElement>(
      'button, a, textarea, input, [tabindex]',
    );
    focusTarget?.focus();
  }, [mobileOpen]);

  if (!mobileOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Close sidebar"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={() => {
          setMobileOpen(false);
          triggerRef.current?.focus();
        }}
        type="button"
      />
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-[min(85vw,320px)] border-r border-slate-900 bg-[var(--sidebar-bg)] px-4 py-5 shadow-2xl',
          className,
        )}
        id="mobile-sidebar"
        ref={panelRef}
      >
        <div className="flex h-full flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};
