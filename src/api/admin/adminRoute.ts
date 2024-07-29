import express, { Router } from 'express';

import { blockUser, deleteUser, getUsers, updateUser } from '@/common/controllers/admin';
import { registerUser } from '@/common/controllers/auth';
import { authenticate } from '@/common/middleware/auth/';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  BlockUserValidationSchema,
  DeleteUserValidationSchema,
  GetUsersSearchParamsValidationSchema,
  RegisterUserValidationSchema,
  UpdateUserValidationSchema,
} from './adminSchemas';

export const adminPaths = {
  getUsers: '/user',
  updateUser: '/user',
  deleteUser: '/user',
  createUser: '/user/',
  blockUser: '/user/block',
};

const adminRouter: Router = (() => {
  const router = express.Router();

  router.post(adminPaths.createUser, authenticate, validateRequest(RegisterUserValidationSchema), registerUser);
  router.get(adminPaths.getUsers, authenticate, validateRequest(GetUsersSearchParamsValidationSchema), getUsers);
  router.put(adminPaths.updateUser, authenticate, validateRequest(UpdateUserValidationSchema), updateUser);
  router.delete(adminPaths.deleteUser, authenticate, validateRequest(DeleteUserValidationSchema), deleteUser);
  router.put(adminPaths.blockUser, authenticate, validateRequest(BlockUserValidationSchema), blockUser);

  return router;
})();

export { adminRouter };
