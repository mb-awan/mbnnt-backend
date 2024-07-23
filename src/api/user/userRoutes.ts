import express, { Router } from 'express';

import {
  deleteMe,
  disableTwoFactorAuthentication,
  enableTwoFactorAuthentication,
  getMe,
  updateMe,
  updatePassword,
  updatePasswordRequest,
  uploadProfilePic,
} from '@/common/controllers/user';
import { authenticate } from '@/common/middleware/auth';
import { isEmailVerified, isPhoneVerified, UpdatePassword } from '@/common/middleware/user/verification';
import { validateRequest } from '@/common/utils/httpHandlers';
import { UploadImage } from '@/common/utils/uploadFile';

import { UpdateUserSchema, ValidateDeleteUser } from './userSchemas';

const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', authenticate, isEmailVerified, isPhoneVerified, getMe);
  router.put('/me', authenticate, validateRequest(UpdateUserSchema), isEmailVerified, isPhoneVerified, updateMe);
  router.delete('/me', authenticate, validateRequest(ValidateDeleteUser), isEmailVerified, isPhoneVerified, deleteMe);
  router.post('/me/update-password-request', authenticate, isEmailVerified, isPhoneVerified, updatePasswordRequest);
  router.post('/me/profile-pic', authenticate, UploadImage.single('profilePicture'), uploadProfilePic);
  router.put('/me/update-password', authenticate, validateRequest(UpdatePassword), updatePassword);
  router.put('/enable-tfa', authenticate, enableTwoFactorAuthentication);
  router.put('/disable-tfa', authenticate, disableTwoFactorAuthentication);
  return router;
})();

export { userRouter };
