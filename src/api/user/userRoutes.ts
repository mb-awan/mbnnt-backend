import express, { Router } from 'express';

import { deleteMe, getMe, updateMe, updatePasswordRequest, uploadProfilePic } from '@/common/controllers/user';
import { authenticate } from '@/common/middleware/auth';
import { userUpdateValidate } from '@/common/middleware/user';
import { Upload } from '@/common/middleware/user/uploadProfilePic';
import { checkUsersVerifiedEmail, checkUsersVerifiedPhone } from '@/common/middleware/user/verification';

const userRouter: Router = (() => {
  const router = express.Router();

  router.get('/me', authenticate, checkUsersVerifiedEmail, checkUsersVerifiedPhone, getMe);
  router.put('/me', authenticate, userUpdateValidate, checkUsersVerifiedEmail, checkUsersVerifiedPhone, updateMe);
  router.delete('/me', authenticate, checkUsersVerifiedEmail, checkUsersVerifiedPhone, deleteMe);
  router.post(
    '/me/update-password-request',
    authenticate,
    checkUsersVerifiedEmail,
    checkUsersVerifiedPhone,
    updatePasswordRequest
  );

  router.post('/me/profile-pic', authenticate, Upload, uploadProfilePic);

  return router;
})();

export { userRouter };
