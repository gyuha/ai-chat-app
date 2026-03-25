import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import {
  REFRESH_TOKEN_COOKIE,
  type AuthCookie,
  type SessionUser,
} from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { SessionUserDto } from './dto/session-user.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() _dto: LoginDto,
    @Req() request: Request & { user: SessionUserDto },
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.createSession({
      id: request.user.id,
      email: request.user.email,
    });

    this.applyCookies(response, session.cookies);
    return { user: session.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  session(@CurrentUser() user: SessionUser) {
    return this.authService.getSession(user);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    const result = this.authService.clearSession();
    this.applyCookies(response, result.cookies);
    return { ok: true };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const session = await this.authService.refreshSession(refreshToken);
    this.applyCookies(response, session.cookies);
    return { user: session.user };
  }

  private applyCookies(response: Response, cookies: AuthCookie[]) {
    for (const cookie of cookies) {
      response.cookie(cookie.name, cookie.value, cookie.options);
    }
  }
}
