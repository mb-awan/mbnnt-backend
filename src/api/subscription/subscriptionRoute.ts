import express, { Router } from 'express';

import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
} from '@/common/controllers/subscription';
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

  router.get(subscriptionPaths.getAll, getAllSubscriptions);
  router.get(subscriptionPaths.getSingle, getSingleSubscription);
  router.post(subscriptionPaths.create, validateRequest(createSubscriptionSchema), createSubscription);
  router.put(subscriptionPaths.update, validateRequest(createSubscriptionSchema), updateSubscription);
  router.delete(subscriptionPaths.delete, deleteSubscription);

  return router;
})();
