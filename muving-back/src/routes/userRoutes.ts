import express from 'express';
import { checkEmail } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/checkEmail', checkEmail);

export default userRouter;
