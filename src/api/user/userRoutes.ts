import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
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
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';
import { UploadImage } from '@/common/utils/uploadFile';

import {
  DeleteUserValidationSchema,
  OTPValidationSchema,
  UpdatePasswordValidationSchema,
  UpdateUserValidationSchema,
} from './userSchemas';

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

  router.get(userPaths.getMe, authenticate, hasPermission(CommonPermissions.GET_ME), getMe);

  router.put(
    userPaths.updateMe,
    authenticate,
    validateRequest(UpdateUserValidationSchema),
    hasPermission(CommonPermissions.UPDATE_ME),
    updateMe
  );

  router.delete(
    userPaths.deleteMe,
    authenticate,
    validateRequest(DeleteUserValidationSchema),
    hasPermission(CommonPermissions.DELETE_ME),
    deleteMe
  );

  router.post(
    userPaths.requestUpdatePassword,
    authenticate,
    hasPermission(CommonPermissions.REQUEST_PASSWORD_UPDATE),
    updatePasswordRequest
  );

  router.put(
    userPaths.updatePassword,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_PASSWORD),
    validateRequest(UpdatePasswordValidationSchema),
    updatePassword
  );

  router.post(
    userPaths.uploadProfilePic,
    authenticate,
    hasPermission(CommonPermissions.UPLOAD_PROFILE_PIC),
    UploadImage.single('profilePicture'),
    uploadProfilePic
  );

  router.put(
    userPaths.enableTwoFactorAuthentication,
    authenticate,
    hasPermission(CommonPermissions.ENABLE_TWO_FACTOR_AUTHENTICATION),
    enableTwoFactorAuthentication
  );

  router.put(
    userPaths.disableTwoFactorAuthentication,
    authenticate,
    hasPermission(CommonPermissions.DISABLE_TWO_FACTOR_AUTHENTICATION),
    disableTwoFactorAuthentication
  );

  router.put(
    userPaths.requestEmailVerificationOtp,
    authenticate,
    hasPermission(CommonPermissions.REQUEST_EMAIL_VERIFICATION_OTP),
    requestEmailVerificationOtp
  );

  router.put(
    userPaths.verifyEmail,
    authenticate,
    validateRequest(OTPValidationSchema),
    hasPermission(CommonPermissions.VERIFY_EMAIL),
    verifyEmailByOTP
  );

  router.put(
    userPaths.requestPhoneVerificationOTP,
    authenticate,
    hasPermission(CommonPermissions.REQUEST_PHONE_VERIFICATION_OTP),
    requestPhoneVerificationOTP
  );

  router.put(
    userPaths.verifyPhone,
    authenticate,
    validateRequest(OTPValidationSchema),
    hasPermission(CommonPermissions.VERIFY_PHONE),
    verifyPhoneByOTP
  );

  return router;
})();

export { userRouter };
