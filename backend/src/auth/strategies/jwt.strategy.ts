import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  ACCESS_TOKEN_COOKIE,
  type JwtPayload,
  type SessionUser,
} from '../auth.constants';

const extractAccessTokenFromCookie = (request: Request): string | null => {
  const token = request.cookies?.[ACCESS_TOKEN_COOKIE];
  return typeof token === 'string' ? token : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractAccessTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload): SessionUser {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
