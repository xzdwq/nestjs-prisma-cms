import * as argon from 'argon2';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IAuth } from '@/common/configuration/configuration.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { User as UserModel } from '@prisma/client';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signIn(params: SignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const authConfig = this.configService.get<IAuth>('auth');

    const user = await this.userService.findOneByEmail(params.email);
    if (!user) throw new ForbiddenException(authConfig.accessDeniedMessage);

    const verifyPassword = await argon.verify(user.password, params.password);
    if (!verifyPassword) throw new ForbiddenException(authConfig.accessDeniedMessage);

    const tokens = await this.createToken(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async signOut(userId: string): Promise<{ signOut: boolean }> {
    await this.userService.updateUser(userId, { refreshToken: null });
    return { signOut: true };
  }

  public async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const authConfig = this.configService.get<IAuth>('auth');

    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException(authConfig.accessDeniedMessage);

    const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException(authConfig.accessDeniedMessage);

    const tokens = await this.createToken(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async createToken(user: UserModel): Promise<{ accessToken: string; refreshToken: string }> {
    const authConfig = this.configService.get<IAuth>('auth');

    const accessToken = await this.jwt.signAsync(
      { userId: user.id, email: user.email },
      { secret: authConfig.tokenSecret, expiresIn: authConfig.tokenAge },
    );
    const refreshToken = await this.jwt.signAsync(
      { userId: user.id, email: user.email, accessToken },
      { secret: authConfig.refreshTokenSecret, expiresIn: authConfig.refreshTokenAge },
    );

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
  }
}
