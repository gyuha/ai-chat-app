import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signup } from "@/features/auth/api";
import { setAuthenticated } from "@/features/auth/auth.store";
import { isApiErrorStatus } from "@/lib/api/client";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function SignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async (response) => {
      setAuthenticated(response.user);
      await navigate({ to: "/" });
    },
    onError: (error) => {
      if (isApiErrorStatus(error, 409)) {
        setFormError("이미 사용 중인 이메일입니다. 다른 이메일로 회원가입해 주세요.");
        return;
      }

      setFormError("회원가입을 완료하지 못했습니다. 다시 시도해 주세요.");
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

    signupMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <div className="auth-field">
        <label className="auth-label" htmlFor="signup-email">
          이메일
        </label>
        <Input
          autoComplete="email"
          hasError={Boolean(fieldErrors.email)}
          id="signup-email"
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
        <label className="auth-label" htmlFor="signup-password">
          비밀번호
        </label>
        <Input
          autoComplete="new-password"
          hasError={Boolean(fieldErrors.password)}
          id="signup-password"
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
      <Button className="auth-submit" disabled={signupMutation.isPending} type="submit">
        {signupMutation.isPending ? (
          <span className="auth-submit__content">
            <Spinner label="회원가입 처리 중" />
            처리 중
          </span>
        ) : (
          "회원가입"
        )}
      </Button>
    </form>
  );
}
