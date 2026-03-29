import type { ChatMessage } from '@repo/contracts';

import { cn } from '../../lib/utils';

const roleStyles: Record<ChatMessage['role'], string> = {
  assistant: 'mr-auto max-w-[72ch] border border-slate-800/70 bg-slate-950/50 text-slate-100',
  system: 'mx-auto max-w-[72ch] border border-slate-800 bg-slate-900/70 text-slate-300',
  user: 'ml-auto max-w-[80%] bg-slate-200 text-slate-950',
};

const roleLabels: Record<ChatMessage['role'], string> = {
  assistant: 'Assistant',
  system: 'System',
  user: 'You',
};

export const MessageBubble = ({ message }: { message: ChatMessage }) => {
  return (
    <article className={cn('rounded-3xl px-4 py-3 shadow-sm', roleStyles[message.role])}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {roleLabels[message.role]}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7">{message.content}</p>
    </article>
  );
};
