import express, { Router } from 'express';

import { blockUser, deleteUser, editUser, getUsers } from '../../common/controllers/admin/index';
import isAdmin, { validateQueryParams } from '../../common/middleware/admin/index';
import { authenticate } from '../../common/middleware/auth/index';

const adminRouter: Router = (() => {
  const router = express.Router();

  // Get all users
  router.get('/users', authenticate, isAdmin, validateQueryParams, getUsers);

  router.put('/user/edit', authenticate, isAdmin, editUser);

  // Block a user by email
  router.put('/user/block', authenticate, isAdmin, blockUser);

  // Delete a user by email
  router.delete('/user', authenticate, isAdmin, deleteUser);

  return router;
})();

export { adminRouter };
