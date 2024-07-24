import express, { Router } from 'express';

import { blockUser, deleteUser, getUsers, updateUser } from '@/common/controllers/admin';
import { registerUser } from '@/common/controllers/auth';
import { isAdmin } from '@/common/middleware/admin/index';
import { authenticate } from '@/common/middleware/auth/';
import { validateRequest } from '@/common/utils/httpHandlers';

import { ValidateDeleteUser } from '../user/userSchemas';
import { RegisterUserSchema, ValidateQueryParamSchema, ValidateQueryUserUpdateSchema } from './adminSchemas';

const adminRouter: Router = (() => {
  const router = express.Router();

  // Get all users as admin
  router.get('/users', authenticate, isAdmin, validateRequest(ValidateQueryParamSchema), getUsers);

  // Update a user by email as admin
  router.put('/user', authenticate, validateRequest(ValidateQueryUserUpdateSchema), isAdmin, updateUser);

  // Block a user by email as admin
  router.put('/block', authenticate, validateRequest(ValidateDeleteUser), isAdmin, blockUser);

  // Delete a user by email as admin
  router.delete('/user', authenticate, validateRequest(ValidateDeleteUser), isAdmin, deleteUser);
  // create new user as admin
  router.post('/create-user', authenticate, isAdmin, validateRequest(RegisterUserSchema), registerUser);

  return router;
})();

export { adminRouter };
