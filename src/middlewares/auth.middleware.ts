import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const headers = req.headers;

  if (headers && headers.authorization) {
    const secret: string = process.env.JWT_SECRET;

    try {
      const token = headers.authorization.split(' ')[1];
      const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
      const userId = verificationResponse.id;
   

      // if (user) {
      //   req.authorization = {
      //     user
      //   };
      //   next();
      // } else {
      //   next(new HttpException(401, 'Unauthorized'));
      // }
    } catch (error) {
      next(new HttpException(401, 'Unauthorized', error));
    }
  } else {
    next(new HttpException(404, 'Authentication token missing'));
  }
}

export default authMiddleware;
