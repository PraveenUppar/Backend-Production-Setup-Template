import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import AppError from '../utils/AppError';
import config from '../config';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const globalErrorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error with context
  logger.error('Request failed', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    userId: req.userId,
    statusCode: err.statusCode,
    message: err.message,
    stack: config.isDevelopment ? err.stack : undefined,
    error: err.name,
  });

  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.[0] || 'field';
      const appError = new AppError(`The ${field} is already taken.`, 409);
      err = appError;
    }
    // P2025: Record not found
    else if (err.code === 'P2025') {
      const appError = new AppError('Record not found.', 404);
      err = appError;
    }
    // P2003: Foreign key constraint failed
    else if (err.code === 'P2003') {
      const appError = new AppError('Invalid reference.', 400);
      err = appError;
    }
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    err = new AppError('Token expired', 401);
  }

  // Send Response
  if (config.isDevelopment) {
    sendErrorDev(err, res, req);
  } else {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err: ErrorWithStatus, res: Response, req: Request) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    requestId: req.requestId,
    stack: err.stack,
    ...(config.isDevelopment && { error: err }),
  });
};

const sendErrorProd = (err: ErrorWithStatus, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('Unexpected error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export default globalErrorHandler;
