import type { IConfiguration } from '@/common/configuration/configuration.interface';

const MODE = process.env.NODE_ENV || 'production';

export default (): IConfiguration => ({
  mode: MODE,
  host: process.env.HOST || '0.0.0.0',
  port: +process.env.API_PORT || 7000,
  apiPrefix: 'api',
  apiDefaultVersion: '1',
  unknounMask: 'UNKNOWN',
  db: {
    url: process.env.DATABASE_URL,
    log: MODE === 'production' ? ['error'] : ['info', 'query', 'warn', 'error'],
    explicitConnect: true,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: MODE === 'production' ? false : true,
    title: 'XCMS API',
    description: 'XCMS administrator API endpoints',
    version: '1.0',
    path: 'api-docs',
  },
  auth: {
    tokenAge: process.env.TOKEN_AGE,
    refreshTokenAge: process.env.REFRESH_TOKEN_AGE,
    tokenSecret: process.env.TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessDeniedMessage: 'Access denied. Wrong credentials provided.',
    cookieOpt: {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    },
  },
});
