import express, { Router } from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import {
  authenticate,
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
  router.put('/generate-phone-verification-otp', authenticate, PhoneVerificationOTP);
  router.put('/verify-email', authenticate, checkUserVerifiedEmail);
  router.put('/verify-phone', authenticate, checkUserVerifiedPhone);

  return router;
})();
