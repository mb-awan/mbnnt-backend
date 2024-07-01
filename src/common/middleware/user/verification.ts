import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { User } from '@/common/models/user';

export const isEmailVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.id; // Get email from request

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    // Fetch the user from the database by email
    const user = await User.findById(userId).select('emailVerified');

    // Check if the user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
    }

    // Check if the email is verified
    if (!user.emailVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Please verify your email.' });
    }

    // Email is verified, proceed to the next middleware/handler
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error checking email verification', error });
  }
};

export const isPhoneVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.id; // Get id from the request

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    // Fetch the user from the database by id
    const user = await User.findById(userId).select('phoneVerified phone');

    // Check if the user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
    }

    // Check if the phone is verified if provided
    if (user?.phone && !user?.phoneVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Please verify your phone.' });
    }

    // Email is verified, proceed to the next middleware/handler
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error checking Phone verification', error });
  }
};

export const userUpdatePassword = async (req: any, res: any, next: any) => {
  const UpdatePassword = z
    .object({
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
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'], // path of error
      message: 'Passwords must match',
    });
  try {
    await UpdatePassword.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
};
