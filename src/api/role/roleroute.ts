import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import {
  AssignPermissiontoRole,
  createRole,
  deleteRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  updateUserRole,
} from '@/common/controllers/role';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteValdationRoleSchema,
  UpdateValidationRoleSchema,
  ValdationRoleSchema,
  ValidationQueryRoleSchema,
  ValidationRolePermissionSchema,
  ValidationUserRoleSchema,
} from './roleSchemas';

export const RolePaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
  assignPermissions: '/assign-permission',
  changeUserRole: '/change-user-role',
};

export const roleRouter: Router = (() => {
  const router = express.Router();

  router.get(
    RolePaths.getAll,
    authenticate,
    hasPermission(AdminPermissions.READ_ALL_ROLES),
    validateRequest(ValidationQueryRoleSchema),
    getAllRoles
  );

  router.get(RolePaths.getSingle, authenticate, hasPermission(AdminPermissions.READ_ROLE), getSingleRole);

  router.post(
    RolePaths.create,
    authenticate,
    hasPermission(AdminPermissions.CREATE_ROLE),
    validateRequest(ValdationRoleSchema),
    createRole
  );

  router.put(
    RolePaths.update,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_ROLE),
    validateRequest(UpdateValidationRoleSchema),
    updateRole
  );

  router.delete(
    RolePaths.delete,
    authenticate,
    hasPermission(AdminPermissions.DELETE_ROLE),
    validateRequest(DeleteValdationRoleSchema),
    deleteRole
  );

  router.put(
    RolePaths.assignPermissions,
    authenticate,
    hasPermission(AdminPermissions.ASSIGN_NEW_PERMISSION_ROLE),
    validateRequest(ValidationRolePermissionSchema),
    AssignPermissiontoRole
  );

  router.put(
    RolePaths.changeUserRole,
    authenticate,
    hasPermission(AdminPermissions.CHANGE_USER_ROLE),
    validateRequest(ValidationUserRoleSchema),
    updateUserRole
  );

  return router;
})();
