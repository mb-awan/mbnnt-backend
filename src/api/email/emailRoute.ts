import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import {
  createEmail,
  deleteEmail,
  getAllEmails,
  getSingleEmail,
  sendEmail,
  updateEmail,
} from '@/common/controllers/email';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  deleteEmailValidationSchema,
  validationEmailQuerySchema,
  validationEmailSchema,
  validationEmailUpdateSchema,
} from './emailSchema';

export const EmailPath = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
  sendEmail: '/send-email',
};

export const emailRoute: Router = (() => {
  const router = express.Router();

  router.get(
    EmailPath.getAll,
    authenticate,
    validateRequest(validationEmailQuerySchema),
    hasPermission(AdminPermissions.READ_ALL_EMAIL),
    getAllEmails
  );

  router.get(
    EmailPath.getSingle,
    authenticate,
    validateRequest(validationEmailSchema),
    hasPermission(AdminPermissions.READ_EMAIL),
    getSingleEmail
  );

  router.post(
    EmailPath.create,
    authenticate,
    validateRequest(validationEmailSchema),
    hasPermission(AdminPermissions.CREATE_EMAIL),
    createEmail
  );

  router.put(
    EmailPath.update,
    authenticate,
    validateRequest(validationEmailUpdateSchema),
    hasPermission(AdminPermissions.UPDATE_EMAIL),
    updateEmail
  );

  router.delete(
    EmailPath.delete,
    authenticate,
    validateRequest(deleteEmailValidationSchema),
    hasPermission(AdminPermissions.DELETE_EMAIL),
    deleteEmail
  );

  router.post(EmailPath.sendEmail, authenticate, hasPermission(AdminPermissions.SEND_EMAIL), sendEmail);

  return router;
})();
