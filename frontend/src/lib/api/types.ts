export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  status: 'streaming' | 'completed' | 'stopped' | 'error';
  createdAt: string;
}

export interface Chat {
  id: string;
  title?: string;
  systemPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreamOptions {
  onChunk: (content: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}
