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

import { createSubscriptionSchema } from './subscriptionSchema';

export const subscriptionPaths = {
  getAll: '/get-all-subscriptions',
  getSingle: '/get-single-subscription',
  create: '/create-subscription',
  update: '/update-subscription',
  delete: '/delete-subscription',
};

export const subscriptionRouter: Router = (() => {
  const router = express.Router();

  router.get(
    subscriptionPaths.getAll,
    authenticate,
    hasPermission(AdminPermissions.READ_ALL_SUBSCRIPTION),
    getAllSubscriptions
  );

  router.get(
    subscriptionPaths.getSingle,
    authenticate,
    hasPermission(AdminPermissions.READ_ANY_SUBSCRIPTION),
    getSingleSubscription
  );

  router.post(
    subscriptionPaths.create,
    authenticate,
    hasPermission(AdminPermissions.CREATE_PERMISSION),
    validateRequest(createSubscriptionSchema),
    createSubscription
  );

  router.put(
    subscriptionPaths.update,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_SUBSCRIPTION),
    validateRequest(createSubscriptionSchema),
    updateSubscription
  );

  router.delete(
    subscriptionPaths.delete,
    authenticate,
    hasPermission(AdminPermissions.DELETE_SUBSCRIPTION),
    deleteSubscription
  );

  return router;
})();
