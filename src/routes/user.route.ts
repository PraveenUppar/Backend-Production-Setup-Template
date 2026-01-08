import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
} from '../controllers/user.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, signupSchema } from '../schemas/user.schema.js';

const userRouter = Router();

userRouter.post('/sign-up', validate(signupSchema), registerUserController);
userRouter.post('/login', validate(loginSchema), loginUserController);

export default userRouter;
