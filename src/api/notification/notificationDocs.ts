import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { CreateNotificationSchema, NotificationSchema, UpdateNotificationSchema } from './notificationSchema';
export const notificationRegistry = new OpenAPIRegistry();

// get all notification

notificationRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all notification's :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all notification's  from the database.
  `,
  path: '/notification/get-all-notifications',
  tags: ['Notification'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'notifications retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            notifications: z.array(NotificationSchema),
          }),
        },
      },
    },
    401: {
      description: 'Not Authorized',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// get single notification

notificationRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single notification:
          - Validation: Validate the notification ID query parameter.
          - Database Interaction: Fetch a notification from the database.
      `,
  path: '/notification/get-single-notifications',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Notification'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'notification retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            notification: NotificationSchema,
          }),
        },
      },
    },
    401: {
      description: 'Not Authorized',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'notification not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// create notification

notificationRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new notification :
          - Validation: Validate the request body fields including name, email, and message.
          - Database Interaction: Save the new notification to the database.
      `,
  path: '/notification/create-notification',
  request: {
    body: {
      description: 'notification detail',
      content: {
        'application/json': {
          schema: CreateNotificationSchema,
        },
      },
    },
  },
  tags: ['Notification'],
  security: [{ bearerAuth: [] }],

  responses: {
    201: {
      description: 'notification created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            notification: NotificationSchema,
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not Authorized',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// update notification

notificationRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing notification:
          - Validation: Validate the request body fields.
          - Database Interaction: Update the notification  in the database.
      `,
  path: '/notification/update-notification',
  request: {
    query: z.object({ notificationId: z.string() }),
    body: {
      description: 'notification details',
      content: {
        'application/json': {
          schema: UpdateNotificationSchema,
        },
      },
    },
  },
  tags: ['Notification'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'notification updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            notification: NotificationSchema,
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not Authorized',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// delete notification

notificationRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing notification :
          - Validation: Validate the notification ID query parameter.
          - Database Interaction: Delete the notification from the database.
      `,
  path: '/notification/delete-notification',
  request: {
    query: z.object({ notificationId: z.string() }),
  },
  tags: ['Notification'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'notification deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not Authorized',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'notification not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});
