import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useConversationActions } from '@/hooks/use-conversations-query';

type StartConversationOptions = {
  onNavigate?: () => void;
};

export function useStartConversation() {
  const navigate = useNavigate();
  const conversationActions = useConversationActions();
  const [isPending, setIsPending] = useState(false);

  async function startConversation(options?: StartConversationOptions) {
    setIsPending(true);

    try {
      const conversation =
        await conversationActions.createOrReuseDraftConversation();

      options?.onNavigate?.();

      await navigate({
        params: {
          conversationId: conversation.id,
        },
        to: '/chat/$conversationId',
      });
    } finally {
      setIsPending(false);
    }
  }

  return {
    isPending,
    startConversation,
  };
}
