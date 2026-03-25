import { useSyncExternalStore } from "react";

import type { AuthUser } from "./api";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
};

const defaultAuthState: AuthState = {
  user: null,
  status: "loading",
  isAuthenticated: false,
};

let authState: AuthState = defaultAuthState;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setAuthState(nextState: AuthState) {
  authState = nextState;
  emitChange();
}

export function subscribeAuthState(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getAuthState() {
  return authState;
}

export function setAuthPending() {
  setAuthState({
    user: null,
    status: "loading",
    isAuthenticated: false,
  });
}

export function setAuthenticated(user: AuthUser) {
  setAuthState({
    user,
    status: "authenticated",
    isAuthenticated: true,
  });
}

export function clearAuthState() {
  setAuthState({
    user: null,
    status: "anonymous",
    isAuthenticated: false,
  });
}

export function resetAuthState() {
  authState = defaultAuthState;
  emitChange();
}

export function useAuthStore<T>(selector: (state: AuthState) => T) {
  return useSyncExternalStore(
    subscribeAuthState,
    () => selector(authState),
    () => selector(defaultAuthState),
  );
}
