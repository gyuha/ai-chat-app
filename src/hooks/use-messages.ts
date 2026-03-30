import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db, type Message } from "@/db";

export function useMessages(conversationId: string) {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return db.messages
        .where("conversationId")
        .equals(conversationId)
        .sortBy("createdAt");
    },
    enabled: !!conversationId,
  });
}

export function useAddMessage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Omit<Message, "createdAt">>({
    mutationFn: async (message) => {
      await db.messages.add({
        ...message,
        createdAt: new Date(),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
    },
  });
}
