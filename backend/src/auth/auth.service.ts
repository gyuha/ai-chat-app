import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password: _, ...result } = user;
    return result;
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(user: any) {
    const tokens = await this.generateTokens(user.userId ?? user.id, user.email);
    await this.saveRefreshToken(user.userId ?? user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다");
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();
    return {
      accessToken,
      refreshToken,
      user: { id: userId, email },
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString("hex");
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    await this.usersService.updateRefreshToken(userId, refreshToken);
  }
}
