import { ApiError, buildApiUrl } from "@/lib/api/client";

import type { SendChatMessagePayload } from "./types";

export async function startChatStream(
  conversationId: string,
  payload: SendChatMessagePayload,
) {
  const response = await fetch(buildApiUrl(`/conversations/${conversationId}/chat`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const errorPayload = (await response.json()) as {
        message?: string | string[];
        error?: string;
      };
      const message = Array.isArray(errorPayload.message)
        ? errorPayload.message.join(", ")
        : errorPayload.message || errorPayload.error || `Request failed with status ${response.status}`;

      throw new ApiError(message, response.status);
    }

    const errorText = await response.text();
    throw new ApiError(errorText || `Request failed with status ${response.status}`, response.status);
  }

  return response;
}
