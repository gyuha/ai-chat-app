import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';
export const BCRYPT_ROUNDS = 12;

export type AuthCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export type SessionUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  user: SessionUser;
};

export type SessionResult = AuthResponse & {
  cookies: AuthCookie[];
};

export type JwtPayload = {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
};
