// Stub - implementation pending
export function useChatStream(
  _modelId: string,
  _systemPrompt: string | null,
) {
  return {
    streamingContent: "",
    isStreaming: false,
    error: null,
    sendMessage: async () => "",
    stopStreaming: () => {},
  };
}
