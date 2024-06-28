import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '@/common/models/user';

export const isEmailVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.id; // Get email from request

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    // Fetch the user from the database by email
    const user = await User.findById(userId).select('emailVerified');

    // Check if the user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found.' });
    }

    // Check if the email is verified
    if (!user.emailVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Please verify your email.' });
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
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    // Fetch the user from the database by id
    const user = await User.findById(userId).select('phoneVerified phone');

    // Check if the user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found.' });
    }

    // Check if the phone is verified if provided
    if (user?.phone && !user?.phoneVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Please verify your phone.' });
    }

    // Email is verified, proceed to the next middleware/handler
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error checking Phone verification', error });
  }
};
