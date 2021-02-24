import { NextFunction, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithUser } from '../interfaces/auth.interface';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const headers = req.headers;

  if (headers && headers.secret_key) {
    const apiKey: string = process.env.API_KEY;
    const secret: string = headers.secret_key;

    if (apiKey !== secret) {
      next(new HttpException(401, 'Invalid secret key'));
    }
    next();
  } else {
    next(new HttpException(401, 'Unauthorized: Missing secret_key'));
  }
}

export default authMiddleware;
