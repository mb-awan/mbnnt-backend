import express, { Router } from 'express';

import { createRole, deleteRole, getAllRoles, getSingleRole, updateRole } from '@/common/controllers/role';
import { roleSchema } from '@/common/middleware/role';
import { validateRequest } from '@/common/utils/httpHandlers';

export const roleRouter: Router = (() => {
  const router = express.Router();

  router.get('/single-role', getSingleRole);
  router.get('/get-all-roles', getAllRoles);
  router.post('/create-role', validateRequest(roleSchema), createRole);
  router.put('/update-role', validateRequest(roleSchema), updateRole);
  router.delete('/delete-role', validateRequest(roleSchema), deleteRole);

  return router;
})();
