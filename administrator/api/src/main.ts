import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ICors, ISwagger } from '@/common/configuration/configuration.interface';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaExceptionFilter } from '@/common/filter/prisma-error.filter';
import { PrismaService } from 'nestjs-prisma';
import cookieParser from 'cookie-parser';

const logger = new Logger('NestApplication');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get<ConfigService>(ConfigService);
  const MODE = config.get<string>('mode');
  const HOST = config.get<string>('host');
  const PORT = config.get<number>('port');
  const API_DEFAULT_VERSION = config.get<string>('apiDefaultVersion');
  const SWAGGER = config.get<ISwagger>('swagger');
  const CORS = config.get<ICors>('cors');

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.enableVersioning({
    defaultVersion: API_DEFAULT_VERSION,
    type: VersioningType.URI,
  });

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  if (SWAGGER.enabled) {
    const options = new DocumentBuilder()
      .setTitle(SWAGGER.title)
      .setDescription(SWAGGER.description)
      .setVersion(SWAGGER.version)
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
        bearerFormat: 'JWT',
      })
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(SWAGGER.path, app, document, {
      swaggerOptions: {
        requestInterceptor: (req: any) => {
          req.credentials = 'include';
          return req;
        },
      },
    });
  }

  if (CORS.enabled) {
    app.enableCors({
      origin: [/^(.*)/],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  await app.listen(PORT, HOST, async () => {
    const appUrl = await app.getUrl();
    logger.log(`🚀 Server NestApi running. Application on url: ${appUrl}`);
    if (SWAGGER.enabled) logger.log(`📗 Swagger url: ${appUrl}/${SWAGGER.path}`);
    logger.log(`✨ host: ${HOST}:${PORT} | pid: ${process.pid} | mode: ${MODE}`);
  });
}
bootstrap();
