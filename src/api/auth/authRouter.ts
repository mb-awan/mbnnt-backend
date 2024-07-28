import express, { Router } from 'express';

import {
  loginUser,
  registerUser,
  requestForgotPasswordOTP,
  resendTFAOTP,
  validateUsername,
  verifyforgotPasswordOTP,
  verifyTwoFactorAuthentication,
} from '@/common/controllers/auth';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  LoginUserValidationSchema,
  RegisterUserValidationSchema,
  RequestForgotPasswordValidationSchema,
  ResendTFAOTPValidationSchema,
  UsernameValidationShema,
  VerifyForgotPasswordValidationSchema,
  VerifyTwoFactorAuthenticationValidationSchema,
} from './authSchemas';

export const authPaths = {
  register: '/register',
  login: '/login',
  verifyUsername: '/verify-username',
  requestForgotPasswordOTP: '/request-forgot-password-otp',
  verifyforgotPasswordOTP: '/verify-forgot-password-otp',
  verifyTwoFactorAuthentication: '/verify-tfa-otp',
  resendTFAOTP: '/resend-tfa-otp',
};

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post(authPaths.register, validateRequest(RegisterUserValidationSchema), registerUser);
  router.post(authPaths.login, validateRequest(LoginUserValidationSchema), loginUser);
  router.get(authPaths.verifyUsername, validateRequest(UsernameValidationShema), validateUsername);
  router.put(
    authPaths.requestForgotPasswordOTP,
    validateRequest(RequestForgotPasswordValidationSchema),
    requestForgotPasswordOTP
  );
  router.get(
    authPaths.verifyforgotPasswordOTP,
    validateRequest(VerifyForgotPasswordValidationSchema),
    verifyforgotPasswordOTP
  );
  router.post(
    authPaths.verifyTwoFactorAuthentication,
    validateRequest(VerifyTwoFactorAuthenticationValidationSchema),
    verifyTwoFactorAuthentication
  );
  router.get(authPaths.resendTFAOTP, validateRequest(ResendTFAOTPValidationSchema), resendTFAOTP);

  return router;
})();
