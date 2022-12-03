import { Request } from 'express';

export interface IJwtPayload {
  id?: string;
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

interface IRequestUser extends Request {
  user: IJwtPayload;
  cookies: ICookies;
}

interface ICookies {
  Authentication: string;
  Refresh: string;
}

export default IRequestUser;
