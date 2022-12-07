import { Response } from 'express';

export enum ECookieKey {
  A = 'Authentication',
  R = 'Refresh',
}

export interface IAuthCookieOptions {
  res: Response;
  accessToken?: string;
  refreshToken?: string;
}
