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
import { updateUserSchema, validateDeleteUser } from '@/common/middleware/user';
import { UploadProfilePicture } from '@/common/middleware/user/uploadProfilePic';
import { isEmailVerified, isPhoneVerified, UpdatePassword } from '@/common/middleware/user/verification';
import { validateRequest } from '@/common/utils/httpHandlers';

const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', authenticate, isEmailVerified, isPhoneVerified, getMe);
  router.put('/me', authenticate, validateRequest(updateUserSchema), isEmailVerified, isPhoneVerified, updateMe);
  router.delete('/me', authenticate, validateRequest(validateDeleteUser), isEmailVerified, isPhoneVerified, deleteMe);
  router.post('/me/update-password-request', authenticate, isEmailVerified, isPhoneVerified, updatePasswordRequest);
  router.post('/me/profile-pic', authenticate, UploadProfilePicture, uploadProfilePic);
  router.put('/me/update-password', authenticate, validateRequest(UpdatePassword), updatePassword);
  router.put('/enable-tfa', authenticate, enableTwoFactorAuthentication);
  router.put('/disable-tfa', authenticate, disableTwoFactorAuthentication);
  return router;
})();

export { userRouter };
