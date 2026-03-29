import { useLayoutEffect, useRef } from 'react';

import { Button } from '../../components/ui/button';
import { useChatShellStore } from '../../store/ui/chat-shell-store';

interface PromptComposerProps {
  chatId: string;
  onSubmit: (value: string) => void;
}

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = '0px';
  const nextHeight = Math.min(textarea.scrollHeight, 160);
  textarea.style.height = `${Math.max(nextHeight, 72)}px`;
};

export const PromptComposer = ({ chatId, onSubmit }: PromptComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const draft = useChatShellStore((state) => state.drafts[chatId] ?? '');
  const setDraft = useChatShellStore((state) => state.setDraft);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    resizeTextarea(textarea);
  }, []);

  const submit = () => {
    const value = draft.trim();
    if (!value) {
      return;
    }

    onSubmit(value);
    setDraft(chatId, '');
  };

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-3 shadow-[0_20px_80px_rgba(2,6,23,0.55)]">
      <label className="sr-only" htmlFor={`prompt-composer-${chatId}`}>
        메시지 입력
      </label>
      <textarea
        aria-label="메시지 입력"
        className="min-h-[72px] w-full resize-none border-0 bg-transparent px-2 py-2 text-[15px] leading-7 text-slate-100 placeholder:text-slate-500 focus:outline-none"
        id={`prompt-composer-${chatId}`}
        onChange={(event) => {
          setDraft(chatId, event.target.value);
          resizeTextarea(event.target);
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) {
            return;
          }

          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Ask anything. Shift+Enter for a new line."
        ref={textareaRef}
        value={draft}
      />

      <div className="flex items-center justify-between gap-3 border-t border-slate-900 px-2 pt-3">
        <p className="text-xs text-slate-500">
          Internal API only. Streaming controls arrive in Phase 3.
        </p>
        <Button onClick={submit} size="sm" type="button">
          Send
        </Button>
      </div>
    </div>
  );
};
