import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userJWTPayload } from '@/common/types/users';

import { env } from './envConfig';

const { JWT_SECRET_KEY, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS } = env;

export const generateToken = (user: any) => {
  const payload: userJWTPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
    phone: user.phone,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET_KEY);

  return decoded;
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  return hashedPassword;
};

export const isValidPassword = async (password: string, hashedPassword: string) => {
  const validPassword = await bcrypt.compare(password, hashedPassword);

  return validPassword;
};
