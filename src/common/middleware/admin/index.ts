import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    console.log(req.user);
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).send({ message: 'Access denied. Admins only.' });
  }
};

export default isAdmin;
