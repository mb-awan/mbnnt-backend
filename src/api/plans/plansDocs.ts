import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import { planPaths } from './plansRoutes';
import {
  DeletePlanValidationSchema,
  PlanSchema,
  UpdatePlanValidationSchema,
  ValidationPlanQuerySchema,
  ValidationPlanSchema,
} from './plansSchema';

export const planRegistry = new OpenAPIRegistry();

// get all plan

planRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all plan's  :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all plan's from the database.
  `,
  path: `${apiRoutes.plans}${planPaths.getAll}`,
  tags: ['Plans'],
  security: [{ bearerAuth: [] }],
  request: {
    query: ValidationPlanQuerySchema,
  },
  responses: {
    200: {
      description: 'plans retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            totalItems: z.number(),
            plan: z.array(PlanSchema),
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
          }),
        },
      },
    },
    404: {
      description: 'plan not found',
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

// get single plan

planRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single planby its ID:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Fetch a plan from the database.
      `,
  path: `${apiRoutes.plans}${planPaths.getSingle}`,
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Plans'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'plan retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            plan: z.array(PlanSchema),
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
          }),
        },
      },
    },
    404: {
      description: 'plan not found',
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

// create plan

planRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new plan  :
          - Validation: Validate the request body fields.
          - Database Interaction: Save the new plan to the database.
      `,
  path: `${apiRoutes.plans}${planPaths.create}`,
  request: {
    body: {
      description: 'plan detail',
      content: {
        'application/json': {
          schema: ValidationPlanSchema,
        },
      },
    },
  },
  tags: ['Plans'],
  security: [{ bearerAuth: [] }],

  responses: {
    201: {
      description: 'plan created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            plan: ValidationPlanSchema,
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

// update plan

planRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows admin to update an existing plan  :
          - Validation: Validate the request body fields.
          - Database Interaction: Update the plan in the database.
      `,
  path: `${apiRoutes.plans}${planPaths.update}`,
  request: {
    query: z.object({ id: z.string() }),
    body: {
      description: 'plan details',
      content: {
        'application/json': {
          schema: UpdatePlanValidationSchema,
        },
      },
    },
  },
  tags: ['Plans'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'plan updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            plan: UpdatePlanValidationSchema,
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
    404: {
      description: 'plan not found',
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

// delete plan

planRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows admin to delete an existing plan  :
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the plan from the database.
      `,
  path: `${apiRoutes.plans}${planPaths.delete}`,
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Plans'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'plan deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            plan: DeletePlanValidationSchema,
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
          }),
        },
      },
    },
    404: {
      description: 'plan not found',
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
