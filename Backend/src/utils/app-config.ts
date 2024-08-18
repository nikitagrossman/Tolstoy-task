import dotenv from 'dotenv';

dotenv.config();

class AppConfig {
  public readonly isDevelopment = process.env.ENVIRONMENT === 'development';
  public readonly isProduction = process.env.ENVIRONMENT === 'production';
  public readonly port = process.env.PORT;
}

export const appConfig = new AppConfig();
