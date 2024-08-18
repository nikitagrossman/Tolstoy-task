import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import {errorsMiddleware} from './middleware/errors-middleware';
import {loggerMiddleware} from './middleware/logger-middleware';
import {dataRouter} from './controllers/metaDataController';
import {securityMiddleware} from './middleware/security-middleware';

class App {
  private PORT = 4000;
  public server = express();

  public start(): void {
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(cookieParser());
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    });
    this.server.use(limiter);
    this.server.use(express.json());
    this.server.use(loggerMiddleware.logToConsole);
    this.server.use(securityMiddleware.preventXssAttack);
    this.server.use('/api', dataRouter);
    this.server.use(errorsMiddleware.routeNotFound);
    this.server.use(errorsMiddleware.catchAll);
    this.server.listen(this.PORT, () =>
      console.log('Listening on http://localhost:' + this.PORT)
    );
  }
}

export const app = new App();
app.start();
