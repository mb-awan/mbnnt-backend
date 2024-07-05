import express, { Router } from 'express';

import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
} from '@/common/controllers/permission';
import { permissionSchema } from '@/common/middleware/permission';
import { validateRequest } from '@/common/utils/httpHandlers';
export const PermissionRouter: Router = (() => {
  const router = express.Router();

  router.get('/single-permission', getSinglePermission);
  router.get('/get-all-permission', getAllPermission);
  router.post('/create-permission', validateRequest(permissionSchema), createPermission);
  router.put('/update-permission', validateRequest(permissionSchema), updatePermission);
  router.delete('/delete-permission', deletePermission);

  return router;
})();
