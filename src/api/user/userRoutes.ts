import express, { Router } from 'express';

import {
  deleteMe,
  disableTwoFactorAuthentication,
  enableTwoFactorAuthentication,
  getMe,
  requestEmailVerificationOtp,
  requestPhoneVerificationOTP,
  updateMe,
  updatePassword,
  updatePasswordRequest,
  uploadProfilePic,
  verifyEmailByOTP,
  verifyPhoneByOTP,
} from '@/common/controllers/user';
import { authenticate } from '@/common/middleware/auth';
import { isEmailVerified, isPhoneVerified, UpdatePassword } from '@/common/middleware/user/verification';
import { validateRequest } from '@/common/utils/httpHandlers';
import { UploadImage } from '@/common/utils/uploadFile';

import { OTPValidationSchema, UpdateUserSchema, ValidateDeleteUser } from './userSchemas';

export const userPaths = {
  getMe: '/me',
  updateMe: '/me',
  deleteMe: '/me',
  requestUpdatePassword: '/me/request-update-password',
  updatePassword: '/me/update-password',
  uploadProfilePic: '/me/profile-pic',
  enableTwoFactorAuthentication: '/me/enable-tfa',
  disableTwoFactorAuthentication: '/me/disable-tfa',
  requestPhoneVerificationOTP: '/request-phone-verification-otp',
  requestEmailVerificationOtp: '/request-email-verification-otp',
  verifyEmail: '/verify-email',
  verifyPhone: '/verify-phone',
};

const userRouter: Router = (() => {
  const router = express.Router();

  router.get(userPaths.getMe, authenticate, isEmailVerified, isPhoneVerified, getMe);
  router.put(
    userPaths.updateMe,
    authenticate,
    validateRequest(UpdateUserSchema),
    isEmailVerified,
    isPhoneVerified,
    updateMe
  );
  router.delete(
    userPaths.deleteMe,
    authenticate,
    validateRequest(ValidateDeleteUser),
    isEmailVerified,
    isPhoneVerified,
    deleteMe
  );
  router.post(userPaths.requestUpdatePassword, authenticate, isEmailVerified, isPhoneVerified, updatePasswordRequest);
  router.put(userPaths.updatePassword, authenticate, validateRequest(UpdatePassword), updatePassword);
  router.post(userPaths.uploadProfilePic, authenticate, UploadImage.single('profilePicture'), uploadProfilePic);
  router.put(userPaths.enableTwoFactorAuthentication, authenticate, enableTwoFactorAuthentication);
  router.put(userPaths.disableTwoFactorAuthentication, authenticate, disableTwoFactorAuthentication);
  router.put(userPaths.requestEmailVerificationOtp, authenticate, requestEmailVerificationOtp);
  router.put(userPaths.verifyEmail, authenticate, validateRequest(OTPValidationSchema), verifyEmailByOTP);
  router.put(userPaths.requestPhoneVerificationOTP, authenticate, requestPhoneVerificationOTP);
  router.put(userPaths.verifyPhone, authenticate, validateRequest(OTPValidationSchema), verifyPhoneByOTP);

  return router;
})();

export { userRouter };
