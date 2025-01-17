import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import { subscriptionPaths } from './subscriptionRoute';
import {
  DeleteValidationSubscriptionSchema,
  UpdateValidationSubscriptionSchema,
  ValidationSubscriptionQuerySchema,
  ValidationSubscriptionSchema,
} from './subscriptionSchema';
export const subscriptionRegistry = new OpenAPIRegistry();

// subscription Details

subscriptionRegistry.registerPath({
  method: 'get',
  description: `
      This endpoint retrieves the subscription information:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the subscription's email to be verified.
          - Phone Verification: Requires the subscription's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role.
      `,
  path: `${apiRoutes.subscriptions}${subscriptionPaths.getSingle}`,
  tags: ['Subscription'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: 'subscription fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            subscriptions: ValidationSubscriptionSchema,
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
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// get all

subscriptionRegistry.registerPath({
  method: 'get',
  description: `
          This endpoint retrieves the all subscription information:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the subscription's email to be verified.
          - Phone Verification: Requires the subscription's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role.

          `,
  path: `${apiRoutes.subscriptions}${subscriptionPaths.getAll}`,
  tags: ['Subscription'],
  security: [{ bearerAuth: [] }],
  request: {
    query: ValidationSubscriptionQuerySchema,
  },
  responses: {
    200: {
      description: 'subscription fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            subscription: ValidationSubscriptionSchema,
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
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// create new subscription

subscriptionRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint Creates subscription :
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the subscription's email to be verified.
          - Phone Verification: Requires the subscription's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role. 
      `,
  path: `${apiRoutes.subscriptions}${subscriptionPaths.create}`,
  tags: ['Subscription'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'Create new  subscription ',
      content: {
        'application/json': {
          schema: ValidationSubscriptionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'subscription Created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            subscription: ValidationSubscriptionSchema,
            success: z.boolean().default(true),
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
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// update subscription profile

subscriptionRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint updates subscription information:
     - Authentication: Requires a valid JWT token.
     - Email Verification: Requires the subscription's email to be verified.
     - Phone Verification: Requires the subscription's phone number to be verified.
     - Admin Role: Requires the requester to have the admin role.
  `,
  path: `${apiRoutes.subscriptions}${subscriptionPaths.update}`,
  tags: ['Subscription'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
    body: {
      description: 'subscription profile update details',
      content: {
        'application/json': {
          schema: UpdateValidationSubscriptionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'subscription updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            subscription: UpdateValidationSubscriptionSchema,
            success: z.boolean().default(true),
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
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// Delete subscription

subscriptionRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint deletes the subscription account:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the subscription's email to be verified.
          - Phone Verification: Requires the subscription's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role.
      `,
  path: `${apiRoutes.subscriptions}${subscriptionPaths.delete}`,
  tags: ['Subscription'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
    body: {
      description: 'subscription account deletion details',
      content: {
        'application/json': {
          schema: DeleteValidationSubscriptionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'subscription deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            subscription: DeleteValidationSubscriptionSchema,
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
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});
