import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import AppError from '../utils/AppError';
import config from '../config';

interface ErrorWithStatus extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}

const globalErrorHandler = (
  err: ErrorWithStatus | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = err as ErrorWithStatus;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Log error with context
  logger.error('Request failed', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    userId: req.userId,
    statusCode: error.statusCode,
    message: error.message,
    stack: config.isDevelopment ? error.stack : undefined,
    error: error.name,
  });

  // Handle Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (error.code === 'P2002') {
      const field = (error.meta?.target as string[])?.[0] || 'field';
      const appError = new AppError(`The ${field} is already taken.`, 409);
      error.statusCode = appError.statusCode;
      error.status = appError.status;
      error.message = appError.message;
      error.isOperational = appError.isOperational;
    }
    // P2025: Record not found
    else if (error.code === 'P2025') {
      const appError = new AppError('Record not found.', 404);
      error.statusCode = appError.statusCode;
      error.status = appError.status;
      error.message = appError.message;
      error.isOperational = appError.isOperational;
    }
    // P2003: Foreign key constraint failed
    else if (error.code === 'P2003') {
      const appError = new AppError('Invalid reference.', 400);
      error.statusCode = appError.statusCode;
      error.status = appError.status;
      error.message = appError.message;
      error.isOperational = appError.isOperational;
    }
  }

  // Handle JWT Errors
  if (error.name === 'JsonWebTokenError') {
    const appError = new AppError('Invalid token', 401);
    error.statusCode = appError.statusCode;
    error.status = appError.status;
    error.message = appError.message;
    error.isOperational = appError.isOperational;
  }
  if (error.name === 'TokenExpiredError') {
    const appError = new AppError('Token expired', 401);
    error.statusCode = appError.statusCode;
    error.status = appError.status;
    error.message = appError.message;
    error.isOperational = appError.isOperational;
  }

  // Send Response
  if (config.isDevelopment) {
    sendErrorDev(error, res, req);
  } else {
    sendErrorProd(error, res);
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
