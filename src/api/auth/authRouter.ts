import express, { Router } from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import {
  authenticate,
  checkUserVerifiedEmail,
  checkUserVerifiedPhone,
  forgotPasswordInputSchema,
  forgotPasswordOTP,
  loginSchema,
  PhoneVerificationOTP,
  registerUserSchema,
  validateOTP,
  validateUsername,
  verifyForgotPasswordInputSchema,
  verifyPasswordOTP,
  verifyUser,
} from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers';

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post('/register', validateRequest(registerUserSchema), registerUser);
  router.post('/login', validateRequest(loginSchema), loginUser);
  router.put('/generate-phone-verification-otp', authenticate, PhoneVerificationOTP);
  router.put('/verify-email', authenticate, validateRequest(validateOTP), checkUserVerifiedEmail);
  router.put('/verify-phone', authenticate, validateRequest(validateOTP), checkUserVerifiedPhone);
  router.get('/verify-username', validateRequest(validateUsername), verifyUser);
  router.put('/forgot-password-otp', validateRequest(forgotPasswordInputSchema), forgotPasswordOTP);
  router.put('/verify-forgot-password-otp', validateRequest(verifyForgotPasswordInputSchema), verifyPasswordOTP);

  return router;
})();
