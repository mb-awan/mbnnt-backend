import express, { Router } from 'express';

import { blockUser, deleteUser, getUsers, searchUsersByFilter } from '../../common/controllers/admin/index';
import isAdmin from '../../common/middleware/admin/index';
import { authenticate } from '../../common/middleware/auth/index';

const adminRouter: Router = (() => {
  const router = express.Router();

  // Get all users
  router.get('/users', authenticate, isAdmin, getUsers);

  router.get('/search', authenticate, isAdmin, searchUsersByFilter);

  // Block a user by ID
  router.put('/user/block', authenticate, isAdmin, blockUser);

  // Delete a user by ID
  router.delete('/user', authenticate, isAdmin, deleteUser);

  return router;
})();

export { adminRouter };
