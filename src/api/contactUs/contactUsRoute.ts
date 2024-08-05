import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import {
  createContactUs,
  deleteContactUsById,
  getAllContactUs,
  getContactUsById,
  updateContactUsById,
} from '@/common/controllers/contactUs';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteValidationContactUsSchema,
  UpdateContactUsValidationSchema,
  ValidationContactUsQuerySchema,
  ValidationContactUsSchema,
} from './contactUsSchemas';

export const ContactUsPath = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

export const contactUsRouter: Router = (() => {
  const router = express.Router();

  router.get(
    ContactUsPath.getAll,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_CONTACT_US),
    validateRequest(ValidationContactUsQuerySchema),
    getAllContactUs
  );

  router.get(ContactUsPath.getSingle, authenticate, hasPermission(CommonPermissions.READ_CONTACT_US), getContactUsById);

  router.post(
    ContactUsPath.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_CONTACT_US),
    validateRequest(ValidationContactUsSchema),
    createContactUs
  );

  router.put(
    ContactUsPath.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_CONTACT_US),
    validateRequest(UpdateContactUsValidationSchema),
    updateContactUsById
  );

  router.delete(
    ContactUsPath.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_CONTACT_US),
    validateRequest(DeleteValidationContactUsSchema),
    deleteContactUsById
  );

  return router;
})();
