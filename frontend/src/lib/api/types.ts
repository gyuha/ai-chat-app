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
