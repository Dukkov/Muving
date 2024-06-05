import dotenv from 'dotenv';

dotenv.config();

type AppConfig = {
  port: number;
};

const appConfig: AppConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000
};

export default appConfig;
