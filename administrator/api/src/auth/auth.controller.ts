import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Res, UseGuards } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import JwtRefreshGuard from '@/auth/guard/jwt-refresh.guard';
import { PublicEndpoint } from '@/common/decorator/public-endpoint.decorator';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { User } from '@/common/decorator/user.decorator';
import { AuthCookieService } from '@/auth/utils/auth-cookie.service';
import { Cookie } from '@/common/decorator/cookie.decorator';
import { ECookieKey } from '@/common/general-interface/auth-cookie.interface';

@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly authCookieService: AuthCookieService) {}

  @PublicEndpoint()
  @Post('sign-in')
  public async signIn(
    @Body() params: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean; signIn: boolean }> {
    const signInResult = await this.authService.signIn(params);

    this.authCookieService.setCookie({
      res,
      accessToken: signInResult.accessToken,
      refreshToken: signInResult.refreshToken,
    });

    return { success: true, signIn: true };
  }

  @Get('sign-out/:id')
  public async signOut(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: true; signOut: boolean }> {
    this.authCookieService.clearCookie({ res });

    const { signOut } = await this.authService.signOut(id);
    return { success: true, signOut };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refreshTokens(
    @Cookie(ECookieKey.R) refreshToken: string,
    @User('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean; refreshToken: boolean }> {
    const refreshResult = await this.authService.refreshToken(userId, refreshToken);

    this.authCookieService.setCookie({
      res,
      accessToken: refreshResult.accessToken,
      refreshToken: refreshResult.refreshToken,
    });

    return { success: true, refreshToken: true };
  }
}
