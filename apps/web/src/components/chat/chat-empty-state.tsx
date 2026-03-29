import { promptExamples } from '../../features/chats/prompt-examples';
import { Button } from '../ui/button';

interface ChatEmptyStateProps {
  modelLabel: string;
  onPromptSelect: (prompt: string) => void;
}

export const ChatEmptyState = ({ modelLabel, onPromptSelect }: ChatEmptyStateProps) => {
  return (
    <section className="mx-auto flex max-w-[840px] flex-1 flex-col justify-center px-4 py-10 md:px-6 md:py-14">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">New conversation</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Start with a clear prompt and the shell is ready for the rest.
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-slate-400">
          Messages are still plain-text in Phase 2, but layout, composer rhythm, and role treatment
          are already locked in for streaming work.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
          <div className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5">
            Model: {modelLabel}
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5">
            Server-side key protection enabled
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {promptExamples.map((prompt) => (
          <Button
            className="h-auto flex-col items-start gap-2 rounded-3xl px-4 py-4 text-left"
            key={prompt}
            onClick={() => onPromptSelect(prompt)}
            type="button"
            variant="secondary"
          >
            <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Example prompt
            </span>
            <span className="text-sm leading-6 text-slate-100">{prompt}</span>
          </Button>
        ))}
      </div>
    </section>
  );
};
