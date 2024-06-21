import express, { Router } from 'express';

import { blockUser, changeRole, deleteUser, getUsers } from '../../common/controllers/admin/index';
import isAdmin from '../../common/middleware/admin/index';
import { authenticate } from '../../common/middleware/auth/index';

const adminRouter: Router = (() => {
  const router = express.Router();

  // Get all users
  router.get('/users', authenticate, isAdmin, getUsers);

  // Block a user by ID
  router.put('/user', authenticate, isAdmin, blockUser);

  // make user to admin

  router.put('/user/role', authenticate, isAdmin, changeRole);

  // Delete a user by ID
  router.delete('/user', authenticate, isAdmin, deleteUser);

  return router;
})();

export { adminRouter };
