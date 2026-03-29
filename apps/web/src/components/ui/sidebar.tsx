import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

import { cn } from '../../lib/utils';

interface SidebarContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(true);
  const value = useMemo(() => ({ open, setOpen }), [open]);

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
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        'hidden border-r border-slate-800 bg-slate-950/90 px-4 py-5 md:block',
        open ? 'w-[280px]' : 'w-[72px]',
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
