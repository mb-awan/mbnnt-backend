import express, { Router } from 'express';

import { deleteMe, getMe, updateMe, updatePasswordRequest, uploadProfilePic } from '@/common/controllers/user';
import { authenticate } from '@/common/middleware/auth';
import { userUpdateValidate } from '@/common/middleware/user';
import { Upload } from '@/common/middleware/user/uploadProfilePic';
import { isEmailVerified, isPhoneVerified } from '@/common/middleware/user/verification';

const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', authenticate, isEmailVerified, isPhoneVerified, getMe);
  router.put('/me', authenticate, userUpdateValidate, isEmailVerified, isPhoneVerified, updateMe);
  router.delete('/me', authenticate, isEmailVerified, isPhoneVerified, deleteMe);
  router.post('/me/update-password-request', authenticate, isEmailVerified, isPhoneVerified, updatePasswordRequest);

  router.post('/me/profile-pic', authenticate, Upload, uploadProfilePic);

  return router;
})();

export { userRouter };
