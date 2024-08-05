import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
} from '@/common/controllers/permission';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeletePermissionValidationSchema,
  UpdatePermissionValidationSchema,
  ValidationPermissionQuerySchema,
  ValidationPermissionSchema,
} from './permissionSchema';

export const PermissionPaths = {
  getAll: '/get-all-permission',
  getSingle: '/get-single-permission',
  create: '/create-permission',
  update: '/edit-permission',
  delete: '/delete-permission',
};

export const PermissionRouter: Router = (() => {
  const router = express.Router();

  router.get(
    PermissionPaths.getAll,
    authenticate,
    hasPermission(AdminPermissions.READ_ALL_PERMISSIONS),
    validateRequest(ValidationPermissionQuerySchema),
    getAllPermission
  );

  router.get(
    PermissionPaths.getSingle,
    authenticate,
    hasPermission(AdminPermissions.READ_PERMISSION),
    getSinglePermission
  );

  router.post(
    PermissionPaths.create,
    authenticate,
    hasPermission(AdminPermissions.CREATE_PERMISSION),
    validateRequest(ValidationPermissionSchema),
    createPermission
  );

  router.put(
    PermissionPaths.update,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_PERMISSION),
    validateRequest(UpdatePermissionValidationSchema),
    updatePermission
  );

  router.delete(
    PermissionPaths.delete,
    authenticate,
    hasPermission(AdminPermissions.DELETE_PERMISSION),
    validateRequest(DeletePermissionValidationSchema),
    deletePermission
  );

  return router;
})();
