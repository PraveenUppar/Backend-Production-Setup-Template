import { z } from 'zod';

export const userSchema = z.object({
  body: z.object({
    // Rule: Must be a string, valid email
    email: z.email({ message: 'Invalid email format' }),

    // Rule: Must be string, min 6 characters
    password: z
      .string({ message: 'Password is required' })
      .min(4, { message: 'Password must be at least 4 characters long' }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
});
