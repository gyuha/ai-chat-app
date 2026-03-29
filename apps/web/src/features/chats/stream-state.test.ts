import type { ChatDetail, ChatMessage } from '@repo/contracts';
import { describe, expect, it } from 'vitest';

import { buildDisplayedMessages } from './stream-state';

const baseChat: ChatDetail = {
  id: 'chat-1',
  title: 'Chat',
  updatedAt: new Date().toISOString(),
  settings: {
    modelId: 'openrouter/auto',
    systemPrompt: '',
  },
  messages: [],
};

const createMessage = (
  partial: Partial<ChatMessage> & Pick<ChatMessage, 'id' | 'role' | 'content'>,
): ChatMessage => ({
  createdAt: new Date().toISOString(),
  status: 'complete',
  ...partial,
});

describe('buildDisplayedMessages', () => {
  it('appends optimistic user and assistant draft during normal generation', () => {
    const optimisticUser = createMessage({
      id: 'user-optimistic',
      role: 'user',
      content: 'Prompt',
    });
    const assistantDraft = createMessage({
      id: 'assistant-draft',
      role: 'assistant',
      content: 'Typing',
      status: 'streaming',
    });

    const displayed = buildDisplayedMessages(baseChat, {
      mode: 'message',
      optimisticUser,
      assistantDraft,
    });

    expect(displayed.map((message) => message.id)).toEqual(['user-optimistic', 'assistant-draft']);
  });

  it('replaces the latest assistant message during regenerate', () => {
    const chat: ChatDetail = {
      ...baseChat,
      messages: [
        createMessage({ id: 'user-1', role: 'user', content: 'Prompt' }),
        createMessage({ id: 'assistant-1', role: 'assistant', content: 'Old answer' }),
      ],
    };

    const displayed = buildDisplayedMessages(chat, {
      mode: 'regenerate',
      replaceMessageId: 'assistant-1',
      assistantDraft: createMessage({
        id: 'assistant-draft',
        role: 'assistant',
        content: 'New answer',
        status: 'streaming',
      }),
    });

    expect(displayed.map((message) => message.id)).toEqual(['user-1', 'assistant-draft']);
  });
});
