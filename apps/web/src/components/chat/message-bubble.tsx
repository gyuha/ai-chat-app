import type { ChatMessage } from '@repo/contracts';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { MessageContent } from './message-content';

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

const statusLabels: Partial<Record<NonNullable<ChatMessage['status']>, string>> = {
  error: 'Error',
  stopped: 'Stopped',
  streaming: 'Streaming',
};

interface MessageBubbleProps {
  canRegenerate?: boolean;
  message: ChatMessage;
  onRegenerate?: () => void;
}

export const MessageBubble = ({
  canRegenerate = false,
  message,
  onRegenerate,
}: MessageBubbleProps) => {
  return (
    <article className={cn('rounded-3xl px-4 py-3 shadow-sm', roleStyles[message.role])}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          {roleLabels[message.role]}
        </p>
        {message.status && statusLabels[message.status] ? (
          <span className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {statusLabels[message.status]}
          </span>
        ) : null}
      </div>
      <MessageContent content={message.content} messageRole={message.role} />
      {canRegenerate && onRegenerate ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={onRegenerate} size="sm" type="button" variant="ghost">
            Regenerate
          </Button>
        </div>
      ) : null}
    </article>
  );
};
