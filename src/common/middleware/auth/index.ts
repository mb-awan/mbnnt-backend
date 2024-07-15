import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { User } from '@/common/models/user';
import { IRoles, IUser } from '@/common/types/users';
import { env } from '@/common/utils/envConfig';

const { JWT_SECRET_KEY } = env;

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

// Authenticate user by token
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

// Check user role
export const checkPermission = (permission: Permissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req?.user?.id).populate({
      path: 'role',
      populate: { path: 'permissions', model: 'Permission', select: '-__v' },
    });

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const role = user.role as any as IRoles;

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
