import { ECookieKey, IAuthCookieOptions } from '@/common/general-interface/auth-cookie.interface';

import { ConfigService } from '@nestjs/config';
import { IAuth } from '@/common/configuration/configuration.interface';
import { Injectable } from '@nestjs/common';
import ms from 'ms';

@Injectable()
export class AuthCookieService {
  constructor(private readonly configService: ConfigService) {}

  public setCookie(opt: IAuthCookieOptions): void {
    opt.res
      .cookie(ECookieKey.A, opt.accessToken, {
        ...this.configService.get<IAuth>('auth').cookieOpt,
        maxAge: ms(this.configService.get<IAuth>('auth').tokenAge),
      })
      .cookie(ECookieKey.R, opt.refreshToken, {
        ...this.configService.get<IAuth>('auth').cookieOpt,
        maxAge: ms(this.configService.get<IAuth>('auth').refreshTokenAge),
      });
  }

  public clearCookie(opt: IAuthCookieOptions): void {
    opt.res.clearCookie(ECookieKey.A).clearCookie(ECookieKey.R);
  }
}
