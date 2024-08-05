import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import { createFaq, deleteFaq, editFaq, getAllFaq, getsingleFaq } from '@/common/controllers/faq';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteFaqValidationSchema,
  UpdateFaqValidationSchema,
  ValidationFaqQuerySchema,
  ValidationFaqSchema,
} from './faqSchema';

export const FaqPaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

const faqRouter: Router = (() => {
  const router = express.Router();

  router.get(
    FaqPaths.getAll,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_FAQ),
    validateRequest(ValidationFaqQuerySchema),
    getAllFaq
  );

  router.get(FaqPaths.getSingle, authenticate, hasPermission(CommonPermissions.READ_FAQ), getsingleFaq);

  router.post(
    FaqPaths.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_FAQ),
    validateRequest(ValidationFaqSchema),
    createFaq
  );

  router.put(
    FaqPaths.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_FAQ),
    validateRequest(UpdateFaqValidationSchema),
    editFaq
  );

  router.delete(
    FaqPaths.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_FAQ),
    validateRequest(DeleteFaqValidationSchema),
    deleteFaq
  );

  return router;
})();

export { faqRouter };
