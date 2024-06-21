import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserRoles } from '@/common/constants/enums';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRoles.ADMIN) {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).send({ message: 'Access denied. Admins only.' });
  }
};

export default isAdmin;
