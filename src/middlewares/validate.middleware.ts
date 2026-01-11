import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import AppError from '../utils/AppError';

/**
 * Validation middleware factory
 * Validates request body, query, and params against Zod schema
 */
const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(
          new AppError(
            `Validation failed: ${formattedErrors.map((e) => e.message).join(', ')}`,
            400,
          ),
        );
      }
      next(error);
    }
  };

export default validate;
