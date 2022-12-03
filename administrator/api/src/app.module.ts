import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { HttpErrorFilter } from '@/common/filter/http-error.filter';
import { IDB } from '@/common/configuration/configuration.interface';
import JwtGuard from '@/auth/guard/jwt.guard';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from '@/user/user.module';
import configuration from '@/common/configuration/configuration';
import { loggingMiddleware } from '@/common/middleware/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: false,
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))],
          explicitConnect: config.get<IDB>('db').explicitConnect,
          errorFormat: 'pretty',
          prismaOptions: {
            log: config.get<IDB>('db').log,
            datasources: {
              db: {
                url: config.get<IDB>('db').url,
              },
            },
          },
        };
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
