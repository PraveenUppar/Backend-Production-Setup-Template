import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware to generate and attach a unique request ID to each request
 * This helps with distributed tracing and log correlation
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Use existing X-Request-ID header if present, otherwise generate new one
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
};
