import {StatusCode} from './enums';

abstract class ClientError {
  public message: string;
  public status: number;

  public constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}

export class RouteNotFoundError extends ClientError {
  public constructor(route: string) {
    super(`Route ${route} not found.`, StatusCode.NotFound);
  }
}
