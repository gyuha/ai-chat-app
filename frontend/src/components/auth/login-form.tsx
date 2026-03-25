import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/features/auth/api";
import { setAuthenticated } from "@/features/auth/auth.store";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginErrorCopy = "로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.";

function validateEmail(value: string) {
  if (!value.trim()) {
    return "이메일을 입력해 주세요.";
  }

  if (!emailPattern.test(value.trim())) {
    return "올바른 이메일 형식을 입력해 주세요.";
  }

  return undefined;
}

function validatePassword(value: string) {
  if (!value.trim()) {
    return "비밀번호를 입력해 주세요.";
  }

  return undefined;
}

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      setAuthenticated(response.user);
      await navigate({ to: "/" });
    },
    onError: () => {
      setFormError(loginErrorCopy);
    },
  });

  function handleEmailBlur() {
    setFieldErrors((current) => ({
      ...current,
      email: validateEmail(email),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setFieldErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">
          이메일
        </label>
        <Input
          autoComplete="email"
          hasError={Boolean(fieldErrors.email)}
          id="login-email"
          name="email"
          onBlur={handleEmailBlur}
          onChange={(event) => {
            setEmail(event.target.value);
            setFormError(null);
          }}
          placeholder="name@example.com"
          type="email"
          value={email}
        />
        {fieldErrors.email ? <p className="auth-field-error">{fieldErrors.email}</p> : null}
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">
          비밀번호
        </label>
        <Input
          autoComplete="current-password"
          hasError={Boolean(fieldErrors.password)}
          id="login-password"
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);
            setFormError(null);
          }}
          type="password"
          value={password}
        />
        {fieldErrors.password ? (
          <p className="auth-field-error">{fieldErrors.password}</p>
        ) : null}
      </div>
      {formError ? <p className="auth-form-error">{formError}</p> : null}
      <Button className="auth-submit" disabled={loginMutation.isPending} type="submit">
        {loginMutation.isPending ? (
          <span className="auth-submit__content">
            <Spinner label="로그인 처리 중" />
            처리 중
          </span>
        ) : (
          "로그인하기"
        )}
      </Button>
    </form>
  );
}
