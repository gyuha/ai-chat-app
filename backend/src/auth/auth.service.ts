import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import {
  ACCESS_TOKEN_COOKIE,
  BCRYPT_ROUNDS,
  REFRESH_TOKEN_COOKIE,
  type AuthCookie,
  type AuthResponse,
  type JwtPayload,
  type SessionResult,
  type SessionUser,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

type UserRecord = Awaited<ReturnType<UsersService['findByEmail']>>;

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: string;
  private readonly refreshTtl: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.accessSecret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshSecret = configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.accessTtl = configService.getOrThrow<string>('JWT_ACCESS_TTL');
    this.refreshTtl = configService.getOrThrow<string>('JWT_REFRESH_TTL');
    this.isProduction = configService.get<string>('NODE_ENV') === 'production';
  }

  async signup(dto: SignupDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.createUser(dto.email, passwordHash);

    return {
      user: this.toSessionUser(user),
    };
  }

  async validateUser(email: string, password: string): Promise<SessionUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.toSessionUser(user);
  }

  async createSession(user: SessionUser): Promise<SessionResult> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user, 'access'),
      this.signToken(user, 'refresh'),
    ]);

    return {
      user,
      cookies: [
        this.buildCookie(ACCESS_TOKEN_COOKIE, accessToken, this.accessTtl),
        this.buildCookie(REFRESH_TOKEN_COOKIE, refreshToken, this.refreshTtl),
      ],
    };
  }

  getSession(user: SessionUser): AuthResponse {
    return { user };
  }

  clearSession(): { ok: true; cookies: AuthCookie[] } {
    const expiredDate = new Date(0);

    return {
      ok: true,
      cookies: [
        {
          name: ACCESS_TOKEN_COOKIE,
          value: '',
          options: {
            ...this.getBaseCookieOptions(),
            expires: expiredDate,
            maxAge: 0,
          },
        },
        {
          name: REFRESH_TOKEN_COOKIE,
          value: '',
          options: {
            ...this.getBaseCookieOptions(),
            expires: expiredDate,
            maxAge: 0,
          },
        },
      ],
    };
  }

  async refreshSession(refreshToken?: string): Promise<SessionResult> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.createSession(this.toSessionUser(user));
  }

  private async signToken(
    user: SessionUser,
    type: JwtPayload['type'],
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type,
    };

    return this.jwtService.signAsync(payload, {
      secret: type === 'access' ? this.accessSecret : this.refreshSecret,
      expiresIn: (type === 'access' ? this.accessTtl : this.refreshTtl) as never,
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private buildCookie(name: string, value: string, maxAgeInput: string): AuthCookie {
    return {
      name,
      value,
      options: {
        ...this.getBaseCookieOptions(),
        maxAge: this.parseDurationToMs(maxAgeInput),
      },
    };
  }

  private getBaseCookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      secure: this.isProduction,
    };
  }

  private toSessionUser(user: NonNullable<UserRecord>): SessionUser {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private parseDurationToMs(duration: string): number {
    const match = duration.trim().match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Unsupported duration format: ${duration}`);
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multiplier: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return value * multiplier[unit];
  }
}
