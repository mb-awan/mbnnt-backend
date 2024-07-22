import { IUser } from './common/types/users';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUser;
  }
}
