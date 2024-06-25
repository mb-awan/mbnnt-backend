import express, { Router } from 'express';

import { blockUser, deleteUser, getUsers, updateUser } from '../../common/controllers/admin/index';
import { isAdmin, valiadateUserUpdate, validateQueryParams } from '../../common/middleware/admin/index';
import { authenticate } from '../../common/middleware/auth/index';

const adminRouter: Router = (() => {
  const router = express.Router();

  // Get all users as admin
  router.get('/users', authenticate, isAdmin, validateQueryParams, getUsers);

  // Update a user by email as admin
  router.put('/user/', authenticate, isAdmin, valiadateUserUpdate, updateUser);

  // Block a user by email as admin
  router.put('/user/block', authenticate, isAdmin, blockUser);

  // Delete a user by email as admin
  router.delete('/user', authenticate, isAdmin, deleteUser);

  return router;
})();

export { adminRouter };
