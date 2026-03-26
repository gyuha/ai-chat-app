export type SendChatMessagePayload = {
  content: string;
};

export type StreamDelta = {
  type: "delta" | "done" | "error";
  content?: string;
  message?: string;
};
