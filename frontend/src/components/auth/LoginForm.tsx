import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../lib/api/auth';
import { useAuthStore } from '../../stores/auth';
import type { LoginDto } from '../../lib/api/types';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      onSuccess();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || '로그인에 실패했습니다';
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">로그인</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          회원가입
        </a>
      </div>
    </div>
  );
}
