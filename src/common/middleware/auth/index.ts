import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { User } from '@/common/models/user';
import { IUser } from '@/common/types/users';
import { env } from '@/common/utils/envConfig';
import { generateOTP } from '@/common/utils/generateOTP';

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

//phone verification opt generated

export const PhoneVerificationOTP = async (req: any, res: any) => {
  const { id } = req.user;

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.phone) {
      return res.status(404).json({ msg: 'Phone number not found' });
    }

    if (user.phoneVerified) {
      return res.status(400).json({ msg: 'Phone already verified' });
    }

    // Generate a 5 digit OTP
    const otp = generateOTP();

    user.phoneVerificationOTP = otp;
    await user.save();

    return res.status(StatusCodes.OK).json({ msg: 'Phone verification OTP has been sent' });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// verify email otp

export const checkUserVerifiedEmail = async (req: any, res: any) => {
  const { otp } = req.query;
  const { id } = req.user;

  if (!otp) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'OTP is required' });
  }

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  try {
    // Get the user ID from the request object set by auth middleware
    const user = await User.findById(id);
    // Find the user by ID
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unauthorized' });
    }
    // Check if the OTP matches
    if (user.emailVerificationOTP === otp) {
      // Update emailVerified and remove emailVerificationOTP
      user.emailVerified = true;
      user.emailVerificationOTP = '';
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid OTP' });
    }
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// phone verified

export const checkUserVerifiedPhone = async (req: any, res: any) => {
  const { otp } = req.query;
  const { id } = req.user;

  if (!otp) {
    return res.status(400).json({ msg: 'OTP is required' });
  }

  if (!id) {
    return res.status(401).json({ msg: 'Not Authorized' });
  }

  try {
    // Get the user ID from the request object set by auth middleware
    const user = await User.findById(id);
    // Find the user by ID
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Check if the OTP matches
    if (user.phoneVerificationOTP === otp) {
      // Update emailVerified and remove emailVerificationOTP
      user.phoneVerified = true;
      user.phoneVerificationOTP = '';
      await user.save();

      res.json({ msg: 'Phone verified successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid OTP' });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
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
    user?: IUser;
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

    req.user = user as IUser;
    next();
  });
};
