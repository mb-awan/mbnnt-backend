import express, { Router } from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import {
  authenticate,
  checkUserVerifiedEmail,
  checkUserVerifiedPhone,
  forgetPasswordOTP,
  PhoneVerificationOTP,
  userLoginValidate,
  userRegisterValidate,
  verifyPasswordOTP,
  verifyUser,
} from '@/common/middleware/auth';

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post('/register', userRegisterValidate, registerUser);
  router.post('/login', userLoginValidate, loginUser);
  router.put('/generate-phone-verification-otp', authenticate, PhoneVerificationOTP);
  router.put('/verify-email', authenticate, checkUserVerifiedEmail);
  router.put('/verify-phone', authenticate, checkUserVerifiedPhone);
  router.get('/verify-username', verifyUser);
  router.put('/forget-password-otp', forgetPasswordOTP);
  router.put('/verify-password-otp', verifyPasswordOTP);

  return router;
})();
