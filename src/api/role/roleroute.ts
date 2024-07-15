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
import { roleSchema } from '@/common/middleware/role';
import { validateRequest } from '@/common/utils/httpHandlers';

export const roleRouter: Router = (() => {
  const router = express.Router();

  router.get('/single-role', getSingleRole);
  router.get('/get-all-roles', getAllRoles);
  router.post('/create-role', validateRequest(roleSchema), createRole);
  router.put('/update-role', validateRequest(roleSchema), updateRole);
  router.delete('/delete-role', validateRequest(roleSchema), deleteRole);
  router.put('/update-role-permission', validateRequest(roleSchema), AssignPermissiontoRole);
  router.put('/update-user-role', validateRequest(roleSchema), updateUserRole);

  return router;
})();
