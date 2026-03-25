import { apiRequest } from "@/lib/api/client";

export type AuthUser = { id: string; email: string };
export type AuthResponse = { user: AuthUser };
export type LogoutResponse = { ok: true };
export type LoginPayload = { email: string; password: string };
export type SignupPayload = { email: string; password: string };

export function signup(payload: SignupPayload) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function logout() {
  return apiRequest<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
}

export function getSession() {
  return apiRequest<AuthResponse>("/auth/session");
}

export function refreshSession() {
  return apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
  });
}
