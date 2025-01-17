import { z } from 'zod';

import { NotificationTypes } from '@/common/constants/enums';

const notificationTypes: [string, ...string[]] = Object.values(NotificationTypes) as [string, ...string[]];

export const ValidationNotificationQuerySchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
  id: z.string().optional(),
  title: z.string().optional(),
});

export const ValidationNotificationSchema = z.object({
  type: z.enum(notificationTypes, { required_error: 'Type is required' }),
  title: z.string({ required_error: 'Title is required' }),
  body: z.string({ required_error: 'Body is required' }),
  data: z.any().optional(),
  read: z.boolean().default(false),
});

export const UpdateNotificationSchema = z.object({
  type: z.enum(notificationTypes).optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  data: z.any().optional(),
  read: z.boolean().optional(),
});

export const DeleteNotificationValidationSchema = z.object({
  type: z.enum(notificationTypes, { required_error: 'Type is required' }),
  title: z.string({ required_error: 'Title is required' }),
  body: z.string({ required_error: 'Body is required' }),
  data: z.any().optional(),
  read: z.boolean().default(false),
});
