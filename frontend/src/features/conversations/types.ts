export type ConversationSummary = {
  id: string;
  title: string;
};

export type CreateConversationPayload = {
  mode?: "default" | "bootstrap";
};
