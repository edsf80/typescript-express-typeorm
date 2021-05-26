import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import RequestWithUser from '../models/request-with-user.model'
import { UserRepository } from '../repositories/user.repository'
import { getConnection } from 'typeorm';
import HttpException from '../exceptions/http.exception';


async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET || '';
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as { _id: number };
      const id = verificationResponse._id;
      const repository = getConnection().getCustomRepository(UserRepository);
      const user = await repository.findOne(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new HttpException('Failed to verify user credentials.', 400));
      }
    } catch (error) {
      next(new HttpException('Failed to verify user credentials.', 500));
    }
  } else {
    next(new HttpException('Failed to verify user credentials.', 400));
  }
}

export default authMiddleware;