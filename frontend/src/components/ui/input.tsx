import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ className, hasError = false, ...props }: InputProps) {
  const classes = ["auth-input", hasError ? "is-error" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return <input className={classes} {...props} />;
}
