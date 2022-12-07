import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Cookie = createParamDecorator((data: string | undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (!data) return request.cookies;
  return request.cookies[data];
});
