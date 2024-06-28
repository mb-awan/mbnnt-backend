import express, { Router } from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import {
  checkUserVerifiedEmail,
  checkUserVerifiedPhone,
  PhoneVerificationOTP,
  userLoginValidate,
  userRegisterValidate,
} from '@/common/middleware/auth';

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post('/register', userRegisterValidate, registerUser);
  router.post('/login', userLoginValidate, loginUser);
  router.put('/phoneVerificationOTP', userLoginValidate, PhoneVerificationOTP);
  router.put('/verifyEmail', userLoginValidate, checkUserVerifiedEmail);
  router.put('/verifyPhone', userLoginValidate, checkUserVerifiedPhone);

  return router;
})();
