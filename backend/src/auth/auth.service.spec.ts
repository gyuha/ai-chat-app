import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const bcryptHash = jest.mocked(bcrypt.hash);
  const bcryptCompare = jest.mocked(bcrypt.compare);

  const usersService = {
    createUser: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const configService = {
    getOrThrow: jest.fn((key: string) => {
      const values: Record<string, string> = {
        JWT_ACCESS_SECRET: 'access-secret-access-secret-access',
        JWT_REFRESH_SECRET: 'refresh-secret-refresh-secret',
        JWT_ACCESS_TTL: '15m',
        JWT_REFRESH_TTL: '7d',
        NODE_ENV: 'test',
      };

      const value = values[key];
      if (!value) {
        throw new Error(`Unexpected config key: ${key}`);
      }

      return value;
    }),
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('hashes passwords before persistence and returns only safe user fields on signup', async () => {
    usersService.findByEmail.mockResolvedValueOnce(null);
    bcryptHash.mockResolvedValueOnce('hashed-password' as never);
    usersService.createUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.signup({
        email: 'user@example.com',
        password: 'password1234',
      }),
    ).resolves.toEqual({
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    });

    expect(bcryptHash).toHaveBeenCalledWith('password1234', 12);
    expect(usersService.createUser).toHaveBeenCalledWith(
      'user@example.com',
      'hashed-password',
    );
  });

  it('rejects duplicate signup with conflict', async () => {
    usersService.findByEmail.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.signup({
        email: 'user@example.com',
        password: 'password1234',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('issues access and refresh cookies without leaking secrets or token strings in the JSON payload', async () => {
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    await expect(
      service.createSession({
        id: 'user-1',
        email: 'user@example.com',
      }),
    ).resolves.toEqual({
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
      cookies: [
        expect.objectContaining({
          name: 'access_token',
          value: 'access-token',
          options: expect.objectContaining({
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: false,
          }),
        }),
        expect.objectContaining({
          name: 'refresh_token',
          value: 'refresh-token',
          options: expect.objectContaining({
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: false,
          }),
        }),
      ],
    });
  });

  it('validates local credentials and rejects invalid passwords', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    bcryptCompare.mockResolvedValueOnce(true as never).mockResolvedValueOnce(false as never);

    await expect(
      service.validateUser('user@example.com', 'password1234'),
    ).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });

    await expect(
      service.validateUser('user@example.com', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('restores session from refresh token without exposing refresh secret values', async () => {
    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'user-1',
      email: 'user@example.com',
      type: 'refresh',
    });
    usersService.findById.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.refreshSession('refresh-token')).resolves.toEqual({
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
      cookies: expect.arrayContaining([
        expect.objectContaining({ name: 'access_token' }),
        expect.objectContaining({ name: 'refresh_token' }),
      ]),
    });
  });
});
