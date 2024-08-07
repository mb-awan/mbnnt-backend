import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
} from '@/common/controllers/subscription';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteValidationSubscriptionSchema,
  UpdateValidationSubscriptionSchema,
  ValidationSubscriptionQuerySchema,
  ValidationSubscriptionSchema,
} from './subscriptionSchema';

export const subscriptionPaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

export const subscriptionRouter: Router = (() => {
  const router = express.Router();

  router.get(
    subscriptionPaths.getAll,
    authenticate,
    hasPermission(AdminPermissions.READ_ALL_SUBSCRIPTION),
    validateRequest(ValidationSubscriptionQuerySchema),
    getAllSubscriptions
  );

  router.get(
    subscriptionPaths.getSingle,
    authenticate,
    hasPermission(AdminPermissions.READ_ANY_SUBSCRIPTION),
    validateRequest(ValidationSubscriptionSchema),
    getSingleSubscription
  );

  router.post(
    subscriptionPaths.create,
    authenticate,
    hasPermission(AdminPermissions.CREATE_PERMISSION),
    validateRequest(ValidationSubscriptionSchema),
    createSubscription
  );

  router.put(
    subscriptionPaths.update,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_SUBSCRIPTION),
    validateRequest(UpdateValidationSubscriptionSchema),
    updateSubscription
  );

  router.delete(
    subscriptionPaths.delete,
    authenticate,
    hasPermission(AdminPermissions.DELETE_SUBSCRIPTION),
    validateRequest(DeleteValidationSubscriptionSchema),
    deleteSubscription
  );

  return router;
})();
