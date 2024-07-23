import express, { Router } from 'express';

import {
  generateEmailVerificationOtp,
  generatePhoneVerificationOTP,
  loginUser,
  registerUser,
  requestForgotPasswordOTP,
  resendTFAOTP,
  validateUsername,
  verifyEmailByOTP,
  verifyforgotPasswordOTP,
  verifyPhoneByOTP,
  verifyTwoFactorAuthentication,
} from '@/common/controllers/auth';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  LoginUserValidationSchema,
  OTPValidationSchema,
  RegisterUserValidationSchema,
  RequestForgotPasswordValidationSchema,
  ResendTFAOTPSchema,
  UsernameValidationShema,
  VerifyForgotPasswordValidationSchema,
  VerifyTwoFactorAuthenticationSchema,
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
  router.post('/verify-tfa-otp', validateRequest(VerifyTwoFactorAuthenticationSchema), verifyTwoFactorAuthentication);
  router.get('/resend-tfa-otp', validateRequest(ResendTFAOTPSchema), resendTFAOTP);

  return router;
})();
