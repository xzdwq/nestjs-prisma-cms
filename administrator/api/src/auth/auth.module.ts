import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { IAuth } from '@/common/configuration/configuration.interface';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from '@/auth/strategy/jwt-refresh.strategy';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<IAuth>('auth').tokenSecret,
          signOptions: {
            expiresIn: config.get<IAuth>('auth').tokenAge,
          },
        };
      },
    }),
    PassportModule.register({
      session: false,
      defaultStrategy: 'jwt',
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
