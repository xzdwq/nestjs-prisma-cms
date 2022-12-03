import { BadRequestException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { IAuth } from '@/common/configuration/configuration.interface';
import { IJwtPayload } from '@/common/general-interface/request-user.interface';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '@/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request?.cookies['Refresh'];
          if (!refreshToken) return null;
          return refreshToken;
        },
      ]),
      secretOrKey: configService.get<IAuth>('auth').refreshTokenSecret,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    if (!payload) throw new BadRequestException('Invalid JWT token');

    const refreshToken = req?.cookies['Refresh'];
    if (!refreshToken) throw new BadRequestException('Invalid refresh token');

    const verifyRefreshToken = await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    if (!verifyRefreshToken) throw new BadRequestException('Token expired');

    return verifyRefreshToken;
  }
}
