import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import RequestUser from '@/common/general-interface/request-user.interface';
import { ConfigService } from '@nestjs/config';
import JwtRefreshGuard from '@/auth/guard/jwt-refresh.guard';
import { Public } from '@/common/decorator/public.decorator';
import { Response } from 'express';
import { IAuth } from '@/common/configuration/configuration.interface';
import ms from 'ms';
import { ApiExcludeController } from '@nestjs/swagger';
import { User } from '@/common/decorator/user.decorator';

@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Public()
  @Post('sign-in')
  public async signIn(
    @Body() params: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ signIn: boolean }> {
    const signInResult = await this.authService.signIn(params);

    res.cookie('Authentication', signInResult.accessToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<IAuth>('auth').tokenAge),
      path: '/',
      sameSite: 'strict',
    });
    res.cookie('Refresh', signInResult.refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<IAuth>('auth').refreshTokenAge),
      path: '/',
      sameSite: 'strict',
    });

    return { signIn: true };
  }

  @Get('sign-out/:id')
  public async signOut(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ signOut: boolean }> {
    res.cookie('Authentication', null, {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });
    res.cookie('Refresh', null, {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    return await this.authService.signOut(id);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refreshTokens(
    @Req() request: RequestUser,
    @User('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ refreshToken: boolean }> {
    console.log(userId);
    const refreshResult = await this.authService.refreshToken(userId, request.cookies?.Refresh);

    res.cookie('Authentication', refreshResult.accessToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<IAuth>('auth').tokenAge),
      path: '/',
      sameSite: 'strict',
    });
    res.cookie('Refresh', refreshResult.refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<IAuth>('auth').refreshTokenAge),
      path: '/',
      sameSite: 'strict',
    });

    return { refreshToken: true };
  }
}
