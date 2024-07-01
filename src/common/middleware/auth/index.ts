import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';
import { IUser } from '@/common/types/users';
import { generateToken } from '@/common/utils/auth';
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
      userName: z.string({ required_error: 'User name is required' }),

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
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    if (!user.phone) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Phone number not found' });
    }

    if (user.phoneVerified) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Phone already verified' });
    }

    // Generate a 5 digit OTP
    const otp = generateOTP();

    user.phoneVerificationOTP = otp;
    await user.save();

    return res.status(StatusCodes.OK).json({ message: 'Phone verification OTP has been sent' });
  } catch (error: any) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
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
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unauthorized' });
    }
    if (user.emailVerificationOTP === otp) {
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
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'OTP is required' });
  }

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    if (user.phoneVerificationOTP === otp) {
      user.phoneVerified = true;
      user.phoneVerificationOTP = '';
      await user.save();

      res.json({ msg: 'Phone verified successfully' });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid OTP' });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

export const userLoginValidate = async (req: any, res: any, next: any) => {
  const loginSchema = z
    .object({
      userName: z.string({ required_error: 'Username is Required' }).min(3).max(50).optional(),
      email: z.string({ required_error: 'Email is Required' }).min(10).max(100).optional(),
      phone: z.string({ required_error: 'Phone is Required' }).min(7).max(100).optional(),
      password: z.string({ required_error: 'Password is Required' }).min(8),
    })
    .strict()
    .refine((data) => {
      if (!(data.email || data.userName || data.phone)) {
        throw new Error('At least one of email, username, or phone must be provided');
      }
      return true;
    });

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

// verify user

export const verifyUser = async (req: any, res: any) => {
  const { userName } = req.query;
  const user = await User.findOne({ userName });

  try {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ exists: false });
    }

    if (user) {
      if (user.status === UserStatus.DELETED) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
      }

      if (user.status === UserStatus.BLOCKED) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account is blocked' });
      }

      return res.status(StatusCodes.OK).json({ exists: true });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// forget password

export const forgetPasswordOTP = async (req: any, res: any) => {
  try {
    const { email, userName, phone } = req.query;
    if (!email && !userName && !phone) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'At least one of email, username, or phone must be provided.' });
    }
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (userName) {
      user = await User.findOne({ userName });
    } else if (phone) {
      user = await User.findOne({ phone });
    }
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Credentials' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'This account is deleted' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'This account is blocked' });
    }

    const otp = generateOTP();

    user.forgotPasswordOTP = otp;

    await user.save();

    return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// verify password otp

export const verifyPasswordOTP = async (req: any, res: any) => {
  const { otp, userName, email, phone } = req.query;
  if (!otp || !(userName || email || phone)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'OTP and username/email/phone are required' });
  }
  try {
    let user;

    // Find user by username, email, or phone
    if (userName) {
      user = await User.findOne({ userName });
    } else if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User not found' });
    }

    // Check if the OTP matches the forgotPasswordOTP stored in the user document
    if (user.forgotPasswordOTP !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid OTP' });
    }

    const token = await generateToken(user);
    user.forgotPasswordOTP = '';
    await user.save();
    return res.status(StatusCodes.OK).json({ message: 'Logged in successfully', token });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
