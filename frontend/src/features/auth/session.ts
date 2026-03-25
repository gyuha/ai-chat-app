import { useEffect } from "react";

import { useQuery, type QueryClient } from "@tanstack/react-query";

import { getSession } from "./api";
import { clearAuthState, setAuthenticated, setAuthPending } from "./auth.store";
import { isApiErrorStatus } from "@/lib/api/client";

export const sessionQueryKey = ["auth", "session"] as const;

async function fetchSessionUser() {
  try {
    const response = await getSession();

    return response.user;
  } catch (error) {
    if (isApiErrorStatus(error, 401)) {
      clearAuthState();
      return null;
    }

    throw error;
  }
}

export function sessionQueryOptions() {
  return {
    queryKey: sessionQueryKey,
    queryFn: fetchSessionUser,
    retry: false,
    staleTime: 60_000,
  };
}

export function createSessionBootstrap(queryClient: QueryClient) {
  return queryClient.fetchQuery(sessionQueryOptions());
}

export function ensureSession(queryClient: QueryClient) {
  return queryClient.ensureQueryData(sessionQueryOptions());
}

export function useSessionBootstrap() {
  const query = useQuery(sessionQueryOptions());

  useEffect(() => {
    if (query.isPending) {
      setAuthPending();
      return;
    }

    if (query.data) {
      setAuthenticated(query.data);
      return;
    }

    if (query.isSuccess) {
      clearAuthState();
    }
  }, [query.data, query.isPending, query.isSuccess]);

  return query;
}
