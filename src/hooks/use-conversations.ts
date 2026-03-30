import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db, type Conversation } from "@/db";

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      return db.conversations.orderBy("updatedAt").reverse().toArray();
    },
  });
}

interface CreateConversationParams {
  modelId?: string;
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationParams>({
    mutationFn: async ({ modelId = "default" }) => {
      const now = new Date();
      const conversation: Conversation = {
        id: crypto.randomUUID(),
        title: "새 대화",
        modelId,
        createdAt: now,
        updatedAt: now,
      };
      await db.conversations.add(conversation);
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await db.messages.where("conversationId").equals(id).delete();
      await db.conversations.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
