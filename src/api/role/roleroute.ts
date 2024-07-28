import express, { Router } from 'express';

import {
  AssignPermissiontoRole,
  createRole,
  deleteRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  updateUserRole,
} from '@/common/controllers/role';
import { validateRequest } from '@/common/utils/httpHandlers';

import { editUserRole, RolePermission, RoleSchema } from './roleSchemas';

export const roleRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-roles', getAllRoles);
  router.get('/get-single-role', getSingleRole);
  router.post('/create-role', validateRequest(RoleSchema), createRole);
  router.put('/edit-role', validateRequest(RoleSchema), updateRole);
  router.delete('/delete-role', validateRequest(RoleSchema), deleteRole);
  router.put('/edit-role-permission', validateRequest(RolePermission), AssignPermissiontoRole);
  router.put('/edit-user-role', validateRequest(editUserRole), updateUserRole);

  return router;
})();
