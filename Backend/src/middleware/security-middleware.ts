import {NextFunction, Request, Response} from 'express';
import {StatusCode} from '../models/enums';

class SecurityMiddleware {
  public preventXssAttack(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    for (const prop in request.body) {
      const value = request.body[prop];
      if (typeof value === 'string' && value.includes('<script')) {
        response.status(StatusCode.Forbidden).send('Nice try!');
        return;
      }
    }
    next();
  }
}

export const securityMiddleware = new SecurityMiddleware();
