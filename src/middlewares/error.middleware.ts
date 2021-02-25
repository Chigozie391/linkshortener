import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
  const status: number = error.status || 500;
  let message: string = error.message || 'Something went wrong';

  if (error instanceof SyntaxError) {
    message = 'Bad request';
  }

  console.log(status, message, error.stack || '');

  res.status(status).json({ message });
}

export default errorMiddleware;
