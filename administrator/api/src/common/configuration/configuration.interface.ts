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
