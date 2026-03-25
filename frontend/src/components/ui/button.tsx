import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ className, children, type = "button", ...props }: ButtonProps) {
  const classes = ["primary-action", className ?? ""].filter(Boolean).join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
