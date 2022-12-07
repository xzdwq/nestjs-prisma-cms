import { CookieOptions } from 'express';

export interface IConfiguration {
  mode: string;
  host: string;
  port: number;
  apiDefaultVersion: string;
  apiPrefix: string;
  unknounMask: string;
  db: IDB;
  cors: ICors;
  swagger: ISwagger;
  auth: IAuth;
}

export interface IDB {
  url: string;
  log: ('info' | 'query' | 'warn' | 'error')[];
  explicitConnect: boolean;
}

export interface ICors {
  enabled: boolean;
}

export interface ISwagger {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface IAuth {
  tokenAge: string;
  refreshTokenAge: string;
  tokenSecret: string;
  refreshTokenSecret: string;
  accessDeniedMessage: string;
  cookieOpt: CookieOptions;
}
