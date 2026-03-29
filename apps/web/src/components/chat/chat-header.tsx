interface ChatHeaderProps {
  title: string;
  modelLabel: string;
  statusLabel?: string;
}

export const ChatHeader = ({ modelLabel, statusLabel, title }: ChatHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-900/80 bg-[rgba(2,6,23,0.82)] px-4 py-4 backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-[840px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Conversation</p>
          <h1 className="mt-1 truncate text-lg font-semibold text-slate-50 md:text-xl">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {statusLabel ? (
            <div className="rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-xs text-slate-300">
              {statusLabel}
            </div>
          ) : null}
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            {modelLabel}
          </div>
        </div>
      </div>
    </header>
  );
};
