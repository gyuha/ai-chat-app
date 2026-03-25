import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

type AuthMode = "login" | "signup";

type AuthCardProps = {
  mode: AuthMode;
  title: string;
  description: string;
  children: ReactNode;
  footerCopy: string;
  footerAction: string;
  footerTo: "/login" | "/signup";
};

export function AuthCard({
  children,
  description,
  footerAction,
  footerCopy,
  footerTo,
  mode,
  title,
}: AuthCardProps) {
  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="eyebrow">OpenRouter Free Chat</p>
          <div className="auth-mode-switch" aria-label="인증 화면 전환">
            <Link
              className={mode === "login" ? "auth-mode-link is-active" : "auth-mode-link"}
              to="/login"
            >
              로그인
            </Link>
            <Link
              className={mode === "signup" ? "auth-mode-link is-active" : "auth-mode-link"}
              to="/signup"
            >
              회원가입
            </Link>
          </div>
          <div className="auth-copy-stack">
            <h1>{title}</h1>
            <p className="auth-copy">{description}</p>
          </div>
        </div>
        {children}
        <p className="auth-footer">
          <span>{footerCopy}</span>{" "}
          <Link className="auth-inline-link" to={footerTo}>
            {footerAction}
          </Link>
        </p>
      </div>
    </section>
  );
}
