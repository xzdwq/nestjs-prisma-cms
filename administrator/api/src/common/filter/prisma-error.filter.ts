import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { BaseExceptionFilter } from '@nestjs/core';
import { IConfiguration } from '@/common/configuration/configuration.interface';
import { Prisma } from '@prisma/client';
import configuration from '@/common/configuration/configuration';

const config: IConfiguration = configuration();

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  public catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.NotFoundError, host: ArgumentsHost): Response<any, Record<string, any>> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request | any>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.CONFLICT;

    const exceptionShortMessage = exception.message?.split('\n')?.at(-1) || 'Prisma unknown error';

    const errorResponse = {
      success: false,
      code: status,
      error: `Prisma ${exception.name}`,
      timestamp: new Date().toLocaleTimeString('ru', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
      path: request.url,
      method: request.method,
      message: exceptionShortMessage,
    }

    const user = request.user?.email || config.unknounMask;
    Logger.error(`[${user}] ${request.method} ${request.url} ${status} - ${exceptionShortMessage}`, PrismaExceptionFilter.name);

    return response.status(status).json(errorResponse);
  }
}
