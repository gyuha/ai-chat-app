export class UserResponseDto {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
}
