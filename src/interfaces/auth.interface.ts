import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface Authorization {
  user: {};
}

export interface RequestWithUser extends Request {
  authorization: Authorization;
  headers: any;
}
