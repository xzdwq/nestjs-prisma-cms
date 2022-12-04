import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IAuth } from '@/common/configuration/configuration.interface';
import { IJwtPayload } from '@/common/general-interface/request-user.interface';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const swaggerToken = request.get('Authorization')?.replace('Bearer', '')?.trim();
          let accessToken = request?.cookies['Authentication'];

          if (!accessToken && swaggerToken) accessToken = swaggerToken;

          if (!accessToken) return null;
          return accessToken;
        },
      ]),
      secretOrKey: configService.get<IAuth>('auth').tokenSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    if (!payload) throw new UnauthorizedException();
    return payload;
  }
}
