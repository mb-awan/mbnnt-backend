import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import { createPlan, deletePlan, getAllPlans, getSinglePlan, updatePlan } from '@/common/controllers/plans';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeletePlanValidationSchema,
  UpdatePlanValidationSchema,
  ValidationPlanQuerySchema,
  ValidationPlanSchema,
} from './plansSchema';

export const planPaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

export const PlansRouter: Router = (() => {
  const router = express.Router();

  router.get(
    planPaths.getAll,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_PLAN),
    validateRequest(ValidationPlanQuerySchema),
    getAllPlans
  );

  router.get(planPaths.getSingle, authenticate, hasPermission(CommonPermissions.READ_PLAN), getSinglePlan);

  router.post(
    planPaths.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_PLAN),
    validateRequest(ValidationPlanSchema),
    createPlan
  );

  router.put(
    planPaths.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_PLAN),
    validateRequest(UpdatePlanValidationSchema),
    updatePlan
  );

  router.delete(
    planPaths.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_PLAN),
    validateRequest(DeletePlanValidationSchema),
    deletePlan
  );

  return router;
})();
