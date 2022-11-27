import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';

import { APP_FILTER } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { HttpErrorFilter } from '@/common/filter/http-error.filter';
import { IDB } from '@/common/configuration/configuration.interface';
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
