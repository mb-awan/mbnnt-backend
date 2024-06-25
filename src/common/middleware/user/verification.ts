import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '@/common/models/user';

export const checkUsersVerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.body.email || req.query.email; // Get email from body or query

    // Fetch the user from the database by email
    const user = await User.findOne({ email: userEmail }).select('emailVerified');

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

export const checkUsersVerifiedPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.body.email || req.query.email; // Get email from body or query
    // Fetch the user from the database by email
    const user = await User.findOne({ email: userEmail }).select('phoneVerified');

    // Check if the user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found.' });
    }

    // Check if the email is verified
    if (!user.phoneVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Please verify your phone.' });
    }

    // Email is verified, proceed to the next middleware/handler
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error checking Phone verification', error });
  }
};
