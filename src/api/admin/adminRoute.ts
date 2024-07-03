import express, { Router } from 'express';

import { blockUser, deleteUser, getUsers, updateUser } from '@/common/controllers/admin';
import { registerUser } from '@/common/controllers/auth';
import {
  isAdmin,
  registerUserSchema,
  updateUserSchema,
  validateQueryParamSchema,
} from '@/common/middleware/admin/index';
import { authenticate } from '@/common/middleware/auth/index';
import { validateRequest } from '@/common/utils/httpHandlers';

const adminRouter: Router = (() => {
  const router = express.Router();

  // Get all users as admin
  router.get('/users', authenticate, isAdmin, validateRequest(validateQueryParamSchema), getUsers);

  // Update a user by email as admin
  router.put('/user', authenticate, isAdmin, validateRequest(updateUserSchema), updateUser);

  // Block a user by email as admin
  router.put('/block', authenticate, isAdmin, blockUser);

  // Delete a user by email as admin
  router.delete('/user', authenticate, isAdmin, deleteUser);
  // create new user as admin
  router.post('/create-user', authenticate, isAdmin, validateRequest(registerUserSchema), registerUser);

  return router;
})();

export { adminRouter };
