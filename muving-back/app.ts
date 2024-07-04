import express, { Application } from 'express';
import appConfig from './src/config/appConfig';
import userRouter from './src/routes/userRoutes';

const app: Application = express();

app.use(express.json());
app.use('/user', userRouter);
app.get('/', (_, res) => {
  res.status(200).json({ message: 'Hello!' });
});

app.listen(appConfig.port, () => {
  console.log(`Port ${appConfig.port} ready`);
});
