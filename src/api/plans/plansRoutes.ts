import express, { Router } from 'express';

import { createPlan, deletePlan, getAllPlans, getSinglePlan, updatePlan } from '@/common/controllers/plans';
import { isAdmin } from '@/common/middleware/admin';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers';

import { createPlanSchema, updatePlanSchema } from './plansSchema';

export const PlansRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-plans', authenticate, isAdmin, getAllPlans);
  router.get('/get-single-plan', authenticate, isAdmin, getSinglePlan);
  router.post('/create-plan', authenticate, isAdmin, validateRequest(createPlanSchema), createPlan);
  router.put('/edit-plan', authenticate, isAdmin, validateRequest(updatePlanSchema), updatePlan);
  router.delete('/delete-plan', authenticate, isAdmin, deletePlan);

  return router;
})();
