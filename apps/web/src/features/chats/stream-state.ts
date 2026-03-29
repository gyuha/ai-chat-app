import type { ChatDetail, ChatMessage, StreamMode } from '@repo/contracts';

export interface DisplayedStreamState {
  mode?: StreamMode;
  optimisticUser?: ChatMessage;
  assistantDraft?: ChatMessage;
  replaceMessageId?: string;
}

export const buildDisplayedMessages = (
  chat: ChatDetail,
  state?: DisplayedStreamState,
): ChatMessage[] => {
  if (!state) {
    return chat.messages;
  }

  if (state.mode === 'regenerate' && state.assistantDraft) {
    const assistantDraft = state.assistantDraft;
    const replaced = chat.messages.map((message) =>
      message.id === state.replaceMessageId ? assistantDraft : message,
    );

    if (replaced.some((message) => message?.id === assistantDraft.id)) {
      return replaced.filter((message): message is ChatMessage => Boolean(message));
    }

    return [...replaced, assistantDraft].filter((message): message is ChatMessage =>
      Boolean(message),
    );
  }

  return [chat.messages, state.optimisticUser, state.assistantDraft].flatMap((entry) =>
    Array.isArray(entry) ? entry : entry ? [entry] : [],
  );
};
