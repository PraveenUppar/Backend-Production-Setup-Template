import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

export interface TokenPayload {
  id: string;
}

export const generateToken = (userId: string): string => {
  const payload: TokenPayload = { id: userId };
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
  return token;
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
