import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api/auth';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (mode === 'login') {
        const response = await authApi.login({ email, password });
        setAuth(response.user, response.token);
        navigate('/chat');
      } else {
        const response = await authApi.register({ email, password, name: name || undefined });
        setAuth(response.user, response.token);
        navigate('/chat');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // 서버에서 받은 에러 메시지 표시
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError(mode === 'login' ? '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' : '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">AI Chat App</CardTitle>
            <CardDescription>{mode === 'login' ? '로그인하여 시작하세요' : '계정을 생성하세요'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-error bg-error-bg rounded-md">
                  {error}
                </div>
              )}
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    이름
                  </label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="홍길동"
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  이메일
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  비밀번호
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="•••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline bg-transparent border-0 cursor-pointer"
                  disabled={isLoading}
                >
                  {mode === 'login' ? '회원가입' : '로그인'}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
