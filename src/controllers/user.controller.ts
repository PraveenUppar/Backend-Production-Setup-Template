import { Request, Response, NextFunction } from 'express';
import {
  createUserService,
  findUserService,
  verifyUserService,
} from '../services/user.service';
import { generateToken } from '../utils/jwt';
import AppError from '../utils/AppError';

/**
 * Register a new user
 */
export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const newUser = await createUserService({ email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Failed to register user', 500));
  }
};

/**
 * Login user and return JWT token
 */
export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserService(email);
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isPasswordValid = await verifyUserService(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Failed to login user', 500));
  }
};
