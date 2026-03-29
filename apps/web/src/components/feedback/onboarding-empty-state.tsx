import { promptExamples } from '../../features/chats/prompt-examples';
import { Button } from '../ui/button';

interface OnboardingEmptyStateProps {
  modelLabel: string;
  onCreateChat: () => void;
  onPromptSelect: (prompt: string) => void;
}

export const OnboardingEmptyState = ({
  modelLabel,
  onCreateChat,
  onPromptSelect,
}: OnboardingEmptyStateProps) => {
  return (
    <section className="mx-auto flex max-w-[840px] flex-1 flex-col justify-center px-4 py-10 md:px-6 md:py-16">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">OpenRouter Free Chat</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
          A dark, focused workspace for free-model conversations.
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-slate-400 md:text-base">
          Start a new chat, pick from server allowlisted models, and keep the browser isolated from
          your upstream API key.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={onCreateChat} size="lg" type="button">
          Start a new chat
        </Button>
        <div className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-3 text-sm text-slate-300">
          Current default model: {modelLabel}
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {promptExamples.map((prompt) => (
          <button
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-slate-700 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            key={prompt}
            onClick={() => onPromptSelect(prompt)}
            type="button"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Quick start</p>
            <p className="mt-2 text-sm leading-6 text-slate-100">{prompt}</p>
          </button>
        ))}
      </div>
    </section>
  );
};
