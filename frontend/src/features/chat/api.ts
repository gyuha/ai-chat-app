import { ApiError } from "@/lib/api/client";

import type { SendChatMessagePayload } from "./types";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  if (typeof window !== "undefined") {
    return trimTrailingSlash(window.location.origin);
  }

  return "";
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${resolveApiBaseUrl()}${normalizedPath}`;
}

export async function startChatStream(
  conversationId: string,
  payload: SendChatMessagePayload,
) {
  const response = await fetch(buildUrl(`/conversations/${conversationId}/chat`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  return response;
}
