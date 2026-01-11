import { prisma } from '../libs/prisma';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError';
import { CreateUserInput } from '../types/user.types';
import { User } from '@prisma/client';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Create a new user with hashed password
 */
export const createUserService = async (
  userData: CreateUserInput,
): Promise<User> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    BCRYPT_SALT_ROUNDS,
  );

  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
    },
  });

  return newUser;
};

/**
 * Find user by email
 */
export const findUserService = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  });
  return user;
};

/**
 * Verify password against hashed password
 */
export const verifyUserService = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
