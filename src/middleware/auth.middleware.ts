import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import RequestWithUser from '../models/request-with-user.model'
import { UserRepository } from '../repositories/user.repository'
import { getConnection } from 'typeorm';
import HttpException from '../exceptions/http.exception';


async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, '') as { _id: number };
      const id = verificationResponse._id;
      const repository = getConnection().getCustomRepository(UserRepository);
      const user = await repository.findOne(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new HttpException(400, 'Failed to verify user credentials.'));
      }
    } catch (error) {
      next(new HttpException(500, 'Failed to verify user credentials.'));
    }
  } else {
    next(new HttpException(400, 'Failed to verify user credentials.'));
  }
}

export default authMiddleware;