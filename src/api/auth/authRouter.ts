import express, { Router } from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import {
  checkUserVerifiedEmail,
  checkUserVerifiedPhone,
  PhoneVerificationOTP,
  userLoginValidate,
  userRegisterValidate,
} from '@/common/middleware/auth';
import { checkUsersVerifiedEmail, checkUsersVerifiedPhone } from '@/common/middleware/user/verification';

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post('/register', userRegisterValidate, registerUser);
  router.post('/login', userLoginValidate, checkUsersVerifiedEmail, checkUsersVerifiedPhone, loginUser);
  router.put('/phoneVerificationOTP', userLoginValidate, PhoneVerificationOTP);
  router.put('/verifyEmail', userLoginValidate, checkUserVerifiedEmail);
  router.put('/verifyPhone', userLoginValidate, checkUserVerifiedPhone);

  return router;
})();
