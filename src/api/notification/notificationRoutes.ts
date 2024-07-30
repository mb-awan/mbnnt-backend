import express, { Router } from 'express';

import {
  createNotification,
  deleteNotification,
  getAllNotificatons,
  getSingleNotification,
  updateNotification,
} from '@/common/controllers/notification';
import { authenticate } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import { CreateNotificationSchema, UpdateNotificationSchema } from './notificationSchema';

const notificationRoutes: Router = (() => {
  const router = express.Router();

  router.get('/get-all-notifications', authenticate, getAllNotificatons);
  router.get('/get-single-notification', authenticate, getSingleNotification);
  router.post('/create-notification', authenticate, validateRequest(CreateNotificationSchema), createNotification);
  router.put('/update-notification', authenticate, validateRequest(UpdateNotificationSchema), updateNotification);
  router.delete('/delete-notification', authenticate, deleteNotification);

  return router;
})();

export { notificationRoutes };
