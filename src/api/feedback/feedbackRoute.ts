import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import {
  createFeedback,
  deleteFeedback,
  editFeedback,
  getAllFeedback,
  getsingleFeedback,
} from '@/common/controllers/feedback';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeletefeedbackValidationSchema,
  UpdatefeedbackValidationSchema,
  ValidationFeedbackQuerySchema,
  ValidationfeedbackSchema,
} from './feedbackSchema';

export const FeedbackPaths = {
  getall: '/',
  getsingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

const feedbackRouter: Router = (() => {
  const router = express.Router();

  router.get(
    FeedbackPaths.getall,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_FEEDBACK),
    validateRequest(ValidationFeedbackQuerySchema),
    getAllFeedback
  );
  router.get(FeedbackPaths.getsingle, authenticate, hasPermission(CommonPermissions.READ_FEEDBACK), getsingleFeedback);
  router.post(
    FeedbackPaths.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_FEEDBACK),
    validateRequest(ValidationfeedbackSchema),
    createFeedback
  );
  router.put(
    FeedbackPaths.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_FEEDBACK),
    validateRequest(UpdatefeedbackValidationSchema),
    editFeedback
  );
  router.delete(
    FeedbackPaths.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_FEEDBACK),
    validateRequest(DeletefeedbackValidationSchema),
    deleteFeedback
  );

  return router;
})();

export { feedbackRouter };
