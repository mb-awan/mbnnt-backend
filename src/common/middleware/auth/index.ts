import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { userJWTPayload } from '@/common/types/users';
import { env } from '@/common/utils/envConfig';

const { JWT_SECRET_KEY } = env;

export const userRegisterValidate = async (req: any, res: any, next: any) => {
  const addressSchema = z
    .object({
      street: z.string({ required_error: 'Street is required' }),
      city: z.string({ required_error: 'City is required' }),
      state: z.string({ required_error: 'State is required' }),
      zip: z.string({ required_error: 'ZIP code is required' }),
    })
    .strict();

  const registerUserSchema = z
    .object({
      firstName: z.string().optional(),

      lastName: z.string().optional(),

      email: z.string().email('Invalid email address'),

      password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

      confirmPassword: z
        .string({ required_error: 'Confirm password is required' })
        .min(8, 'Confirm password must be at least 8 characters long')
        .regex(/[a-z]/, 'Confirm password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Confirm password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Confirm password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Confirm password must contain at least one special character'),

      phone: z.string({ required_error: 'Phone number is required' }),

      currentAddress: addressSchema.optional(),

      postalAddress: addressSchema.optional(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'], // path of error
      message: 'Passwords must match',
    });

  try {
    await registerUserSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
};

export const userLoginValidate = async (req: any, res: any, next: any) => {
  const loginSchema = z
    .object({
      email: z.string({ required_error: 'Email is Required' }).min(10).max(100),
      password: z.string({ required_error: 'Password is Required' }).min(8),
    })
    .strict();

  try {
    await loginSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: userJWTPayload;
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, JWT_SECRET_KEY as string, (err, user) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid token' });
      return;
    }
    console.log({ user });
    req.user = user as userJWTPayload;
    next();
  });
};
