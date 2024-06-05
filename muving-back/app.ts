import express, { Application } from 'express';
import appConfig from './src/config/appConfig';
import mainRouter from './src/routes/mainRoutes';

const app: Application = express();

app.use(express.json());
app.use('/', mainRouter);

app.listen(appConfig.port, () => {
  console.log(`Port ${appConfig.port} ready`);
});
