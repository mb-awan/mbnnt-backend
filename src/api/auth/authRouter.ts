import express, { Router } from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import { userLoginValidate, userRegisterValidate } from '@/common/middleware/auth';

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post('/register', userRegisterValidate, registerUser);
  router.post('/login', userLoginValidate, loginUser);

  return router;
})();
