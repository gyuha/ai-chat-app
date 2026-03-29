import api from './client';
import type { LoginDto, RegisterDto, AuthResponseDto, UserDto } from './types';

export const authApi = {
  // 회원가입
  register: async (dto: RegisterDto): Promise<AuthResponseDto> => {
    const { data } = await api.post<AuthResponseDto>('/api/auth/register', dto);
    return data;
  },

  // 로그인
  login: async (dto: LoginDto): Promise<AuthResponseDto> => {
    const { data } = await api.post<AuthResponseDto>('/api/auth/login', dto);
    return data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  // 현재 사용자 정보
  me: async (): Promise<UserDto> => {
    const { data } = await api.get<UserDto>('/api/auth/me');
    return data;
  },
};
