import {NextFunction, Request, Response} from 'express';
import {StatusCode} from '../models/enums';
import {RouteNotFoundError} from '../models/client-errors';
import {appConfig} from '../utils/app-config';
class ErrorsMiddleware {
  public routeNotFound(
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    const err = new RouteNotFoundError(request.originalUrl);

    next(err);
  }

  public catchAll(
    err: any,
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    console.log(err);

    const status = err.status || StatusCode.InternalServerError;

    const message =
      status === StatusCode.InternalServerError && appConfig.isProduction
        ? 'Some error, please try again later.'
        : err.message;

    response.status(status).send(message);
  }
}

export const errorsMiddleware = new ErrorsMiddleware();
