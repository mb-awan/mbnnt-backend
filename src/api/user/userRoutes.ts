import express, { Router } from 'express';

import {
  deleteMe,
  generateUserOtp,
  getMe,
  updateMe,
  updatePassword,
  updatePasswordRequest,
  uploadProfilePic,
} from '@/common/controllers/user';
import { authenticate } from '@/common/middleware/auth';
import { userUpdateValidate } from '@/common/middleware/user';
import { Upload } from '@/common/middleware/user/uploadProfilePic';
import { isEmailVerified, isPhoneVerified, UpdatePassword } from '@/common/middleware/user/verification';
import { validateRequest } from '@/common/utils/httpHandlers';

const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', authenticate, isEmailVerified, isPhoneVerified, getMe);
  router.put('/me', authenticate, userUpdateValidate, isEmailVerified, isPhoneVerified, updateMe);
  router.delete('/me', authenticate, isEmailVerified, isPhoneVerified, deleteMe);
  router.post('/me/update-password-request', authenticate, isEmailVerified, isPhoneVerified, updatePasswordRequest);
  router.post('/me/profile-pic', authenticate, Upload, uploadProfilePic);
  router.post('/me/generate-email-otp', authenticate, generateUserOtp);
  router.put('/me/update-password', authenticate, validateRequest(UpdatePassword), updatePassword);

  return router;
})();

export { userRouter };
