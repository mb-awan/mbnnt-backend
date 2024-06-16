import jwt from 'jsonwebtoken';

import { env } from '@/common/utils/envConfig';
const { SECRET_KEY } = env;

let decodedUser: any = null;

const ensureAuthentication = (req: any, res: any, next: any) => {
  if (!req.headers['authorization']) {
    return res.status(403).json({ messege: 'Token Required' });
  }

  try {
    decodedUser = jwt.verify(req.headers['authorization'], SECRET_KEY);
    // return res.status(201).json(decodedUser);
    return next();
  } catch (error) {
    return res.status(403).json({ messege: 'Invalid Token' });
  }
};

export { decodedUser, ensureAuthentication };
