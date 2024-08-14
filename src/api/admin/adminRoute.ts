import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import { blockUser, deleteUser, getUsers, updateUser } from '@/common/controllers/admin';
import { registerUser } from '@/common/controllers/auth';
import { authenticate, hasPermission } from '@/common/middleware/user/';
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

  router.post(
    adminPaths.createUser,
    authenticate,
    hasPermission(AdminPermissions.CREATE_USER),
    validateRequest(RegisterUserValidationSchema),
    registerUser
  );

  router.get(
    adminPaths.getUsers,
    authenticate,
    hasPermission(AdminPermissions.READ_ALL_USERS),
    validateRequest(GetUsersSearchParamsValidationSchema),
    getUsers
  );

  router.put(
    adminPaths.updateUser,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_USER),
    validateRequest(UpdateUserValidationSchema),
    updateUser
  );

  router.delete(
    adminPaths.deleteUser,
    authenticate,
    hasPermission(AdminPermissions.DELETE_USER),
    validateRequest(DeleteUserValidationSchema),
    deleteUser
  );

  router.put(
    adminPaths.blockUser,
    authenticate,
    hasPermission(AdminPermissions.BLOCK_USER),
    validateRequest(BlockUserValidationSchema),
    blockUser
  );

  return router;
})();

export { adminRouter };
