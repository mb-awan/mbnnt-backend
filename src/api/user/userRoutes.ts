import express, { Router } from 'express';

import { deleteMe, getMe, updateMe, updatePasswordRequest } from '@/common/controllers/user';
import { authenticate } from '@/common/middleware/auth';
import { userUpdateValidate } from '@/common/middleware/user';

const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', authenticate, getMe);
  router.put('/me', authenticate, userUpdateValidate, updateMe);
  router.delete('/me', authenticate, deleteMe);
  router.post('/me/update-password-request', authenticate, updatePasswordRequest);

  return router;
})();

export { userRouter };
