import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Email is required' }),
    password: z
      .string({ message: 'Password is required' })
      .min(4, { message: 'Password must be at least 4 characters long' }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Email is required' }),
    password: z.string({ message: 'Password is required' }),
  }),
});
