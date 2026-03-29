import { useAuthStore } from '../../stores/auth';

interface StreamMessageOptions {
  onChunk: (content: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}

export async function streamMessage(
  chatId: string,
  content: string,
  options: StreamMessageOptions,
) {
  const token = useAuthStore.getState().accessToken;
  const controller = new AbortController();

  // 외부에서 제공된 signal이 있으면 연결
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // 마지막 불완전한 라인은 버퍼에 보존
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            options.onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              if (parsed.error === 'stopped') {
                options.onError('stopped');
              } else {
                options.onError(parsed.error);
              }
              return;
            }

            if (parsed.content) {
              options.onChunk(parsed.content);
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', data, e);
          }
        }
      }
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      options.onError('stopped');
    } else {
      options.onError(error.message);
    }
  }

  return controller;
}
