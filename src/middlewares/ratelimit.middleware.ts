import { Request, Response, NextFunction } from 'express';
import { Ratelimit } from '@upstash/ratelimit';
import redis from '../redis/redis';
import AppError from '../utils/AppError';
import config from '../config';
import logger from '../utils/logger';

const limiter = new Ratelimit({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis: redis as any, // Upstash Redis adapter type mismatch
  limiter: Ratelimit.slidingWindow(
    config.rateLimit.maxRequests,
    `${config.rateLimit.windowMs} ms`,
  ),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Skip rate limiting in test environment
  if (config.isTest) {
    return next();
  }

  try {
    // Use user ID if authenticated, otherwise use IP address
    const identifier = req.userId
      ? `user:${req.userId}`
      : (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    const { success, limit, remaining, reset } =
      await limiter.limit(identifier);

    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());

    if (!success) {
      return next(
        new AppError(
          `Too many requests. Limit: ${limit} requests per ${config.rateLimit.windowMs}ms. Please try again later.`,
          429,
        ),
      );
    }

    next();
  } catch (error) {
    logger.error('Rate limiter error:', error);
    // On error, allow the request to proceed (fail open)
    // In production, you might want to fail closed
    next();
  }
};
