import express, { Router } from 'express';

import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
} from '@/common/controllers/permission';
import { validateRequest } from '@/common/utils/httpHandlers';

import { PermissionSchema } from './permissionSchema';
export const PermissionRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-permission', getAllPermission);
  router.get('/get-single-permission', getSinglePermission);
  router.post('/create-permission', validateRequest(PermissionSchema), createPermission);
  router.put('/edit-permission', validateRequest(PermissionSchema), updatePermission);
  router.delete('/delete-permission', deletePermission);

  return router;
})();
