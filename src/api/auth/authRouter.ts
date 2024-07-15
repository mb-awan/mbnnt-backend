import express, { Router } from 'express';

import {
  generateEmailVerificationOtp,
  generatePhoneVerificationOTP,
  loginUser,
  registerUser,
  requestForgotPasswordOTP,
  validateUsername,
  verifyEmailByOTP,
  verifyforgotPasswordOTP,
  verifyPhoneByOTP,
} from '@/common/controllers/auth';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  LoginUserValidationSchema,
  OTPValidationSchema,
  RegisterUserValidationSchema,
  RequestForgotPasswordValidationSchema,
  UsernameValidationShema,
  VerifyForgotPasswordValidationSchema,
} from './authSchemas';

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post('/register', validateRequest(RegisterUserValidationSchema), registerUser);
  router.post('/login', validateRequest(LoginUserValidationSchema), loginUser);
  router.put('/verify-email', authenticate, validateRequest(OTPValidationSchema), verifyEmailByOTP);
  router.put('/verify-phone', authenticate, validateRequest(OTPValidationSchema), verifyPhoneByOTP);
  router.get('/verify-username', validateRequest(UsernameValidationShema), validateUsername);
  router.put('/generate-phone-verification-otp', authenticate, generatePhoneVerificationOTP);
  router.put('/generate-email-verification-otp', authenticate, generateEmailVerificationOtp);
  router.put(
    '/request-forgot-password-otp',
    validateRequest(RequestForgotPasswordValidationSchema),
    requestForgotPasswordOTP
  );
  router.put(
    '/verify-forgot-password-otp',
    validateRequest(VerifyForgotPasswordValidationSchema),
    verifyforgotPasswordOTP
  );

  return router;
})();
