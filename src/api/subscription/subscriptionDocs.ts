import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { subscriptionPaths } from './subscriptionRoute';
import { createSubscriptionSchema } from './subscriptionSchema';
export const subscriptionRegistry = new OpenAPIRegistry();

// subscription Details

subscriptionRegistry.registerPath({
  method: 'get',
  description: `
      This endpoint retrieves the subscription  information:
      `,
  path: `/subscription${subscriptionPaths.getSingle}`,
  tags: ['Subscription'],
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
            subscriptions: createSubscriptionSchema,
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
          `,
  path: `/subscription${subscriptionPaths.getAll}`,
  tags: ['Subscription'],
  responses: {
    200: {
      description: 'subscription fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            subscription: createSubscriptionSchema,
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
  method: 'put',
  description: `
        This endpoint Creates subscription's :
      `,
  path: `/subscription${subscriptionPaths.create}`,
  tags: ['Subscription'],
  request: {
    body: {
      description: 'Create new  subscription ',
      content: {
        'application/json': {
          schema: createSubscriptionSchema,
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
            subscription: createSubscriptionSchema,
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
    This endpoint updates   subscription's  information:
  `,
  path: `/subscription${subscriptionPaths.update}`,
  tags: ['Subscription'],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
    body: {
      description: 'subscription profile update details',
      content: {
        'application/json': {
          schema: createSubscriptionSchema,
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
            subscription: createSubscriptionSchema,
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
          
      `,
  path: `/subscription${subscriptionPaths.delete}`,
  tags: ['Subscription'],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
    body: {
      description: 'subscription account deletion details',
      content: {
        'application/json': {
          schema: createSubscriptionSchema,
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
            subscription: createSubscriptionSchema,
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
