import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import {
  createNotification,
  deleteNotification,
  getAllNotificatons,
  getSingleNotification,
  updateNotification,
} from '@/common/controllers/notification';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteNotificationValidationSchema,
  UpdateNotificationSchema,
  ValidationNotificationQuerySchema,
  ValidationNotificationSchema,
} from './notificationSchema';

export const NotificationPaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

const notificationRoutes: Router = (() => {
  const router = express.Router();

  router.get(
    NotificationPaths.getAll,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_NOTIFICATION),
    validateRequest(ValidationNotificationQuerySchema),
    getAllNotificatons
  );

  router.get(
    NotificationPaths.getSingle,
    authenticate,
    hasPermission(CommonPermissions.READ_NOTIFICATION),
    getSingleNotification
  );

  router.post(
    NotificationPaths.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_NOTIFICATION),
    validateRequest(ValidationNotificationSchema),
    createNotification
  );

  router.put(
    NotificationPaths.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_NOTIFICATION),
    validateRequest(UpdateNotificationSchema),
    updateNotification
  );

  router.delete(
    NotificationPaths.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_NOTIFICATION),
    validateRequest(DeleteNotificationValidationSchema),
    deleteNotification
  );

  return router;
})();

export { notificationRoutes };
