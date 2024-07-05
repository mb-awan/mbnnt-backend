import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';
import { IUser } from '@/common/types/users';
import { generateToken, hashOTP, hashPassword, isValidOTP } from '@/common/utils/auth';
import { env } from '@/common/utils/envConfig';
import { generateOTP } from '@/common/utils/generateOTP';

const { JWT_SECRET_KEY } = env;

const addressSchema = z
  .object({
    street: z.string({ required_error: 'Street is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    zip: z.string({ required_error: 'ZIP code is required' }),
  })
  .strict();

const userRoles: [string, ...string[]] = Object.values(UserRoles).filter(
  (role) => role !== UserRoles.ADMIN && role !== UserRoles.SUB_ADMIN
) as [string, ...string[]];

export const registerUserSchema = z
  .object({
    username: z.string({ required_error: 'username is required' }),

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

    role: z.enum(userRoles, { required_error: 'Role is required' }),

    phone: z.string({ required_error: 'Phone number is required' }),

    currentAddress: addressSchema.optional(),

    postalAddress: addressSchema.optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export const loginSchema = z
  .object({
    username: z.string().min(3).max(50).optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),

    password: z
      .string({ required_error: 'Password is Required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const validateOTP = z
  .object({
    otp: z.string({ required_error: 'OTP Required' }).min(5).max(5),
  })
  .strict();

export const validateUsername = z
  .object({
    username: z.string({ required_error: 'Username Required' }).min(3).max(10),
  })
  .strict();

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
    console.log(otp);
    const hashedOTP = hashPassword(otp);
    user.phoneVerificationOTP = await hashedOTP;
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

    const validOTP = await isValidOTP(otp, user.emailVerificationOTP);
    if (validOTP) {
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

    const validOTP = await isValidOTP(otp, user.phoneVerificationOTP);
    if (validOTP) {
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

export const checkPermission = (permission: Permissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req?.user?.id).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const role = user.role as any;

    if (!role) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Role not found' });
    }

    const hasPermission = role.permissions.some((perm: any) => perm.name === permission);

    if (!hasPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }

    next();
  };
};

// verify user
export const verifyUser = async (req: any, res: any) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ exists: false });
    }

    if (user) {
      if (user.status === UserStatus.BLOCKED) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account is blocked' });
      }

      return res.status(StatusCodes.OK).json({ exists: true });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// forgot password
export const forgotPasswordOTP = async (req: any, res: any) => {
  try {
    const { email, username, phone } = req.query;
    if (!email && !username && !phone) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'At least one of email, username, or phone must be provided.' });
    }
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    } else if (phone) {
      user = await User.findOne({ phone });
    }
    if (!user) {
      return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    }

    const otp = generateOTP();
    console.log(otp);
    const hashedOTP = await hashOTP(otp);

    user.forgotPasswordOTP = hashedOTP;

    await user.save();

    return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// verify password otp
export const verifyPasswordOTP = async (req: any, res: any) => {
  const { otp, username, email, phone } = req.query;

  try {
    // Find user by username, email, or phone
    const user = await User.findOne({
      ...(email && { email }),
      ...(username && { username }),
      ...(phone && { phone }),
    }).populate({
      path: 'role',
      select: '-__v',
      populate: {
        path: 'permissions',
        model: 'Permission',
        select: '-__v',
      },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Username or email or password' });
    }
    const validOTP = await isValidOTP(otp, user.forgotPasswordOTP);
    // Check if the OTP matches the forgotPasswordOTP stored in the user document
    if (!validOTP) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'OTP does not match' });
    }

    if (validOTP) {
      const token = await generateToken(user);
      user.forgotPasswordOTP = '';
      await user.save();
      return res.status(StatusCodes.OK).json({ message: 'User Validated', token });
    }
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const forgotPasswordInputSchema = z
  .object({
    username: z.string().min(3).max(50).optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const verifyForgotPasswordInputSchema = z
  .object({
    otp: z.string({ required_error: 'please provide the OTP' }).min(5).max(5),

    username: z.string().min(3).max(50).optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });
