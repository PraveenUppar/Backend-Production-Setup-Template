import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { verifyToken } from '../utils/jwt';
import config from '../config';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Skip authentication in test environment
  if (config.isTest) {
    if (!config.test.userId) {
      return next(new AppError('TEST_USER_ID not configured', 500));
    }
    req.userId = config.test.userId;
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};
