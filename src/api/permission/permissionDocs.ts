import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import {
  DeletePermissionValidationSchema,
  UpdatePermissionValidationSchema,
  ValidationPermissionQuerySchema,
  ValidationPermissionSchema,
} from './permissionSchema';
import { PermissionPaths } from './premissionroute';

export const permissionRegistry = new OpenAPIRegistry();

// get all permission

permissionRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all permission's  :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all permission's from the database.
  `,
  path: `${apiRoutes.permissions}${PermissionPaths.getAll}`,
  tags: ['Permission'],
  security: [{ bearerAuth: [] }],
  request: {
    query: ValidationPermissionQuerySchema,
  },
  responses: {
    200: {
      description: 'permission retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            totalItems: z.number(),
            permissions: ValidationPermissionSchema,
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
      description: 'permission not found',
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

// get single permission

permissionRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single permissionby its ID:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Fetch a permission from the database.
      `,
  path: `${apiRoutes.permissions}${PermissionPaths.getSingle}`,
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Permission'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'permission retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            permission: ValidationPermissionSchema,
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
      description: 'permission not found',
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

// create permission

permissionRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new permission  :
          - Validation: Validate the request body fields.
          - Database Interaction: Save the new permission to the database.
      `,
  path: `${apiRoutes.permissions}${PermissionPaths.create}`,
  request: {
    body: {
      description: 'permission detail',
      content: {
        'application/json': {
          schema: ValidationPermissionSchema,
        },
      },
    },
  },
  tags: ['Permission'],
  security: [{ bearerAuth: [] }],

  responses: {
    201: {
      description: 'permission created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            permission: ValidationPermissionSchema,
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

// update permission

permissionRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing permission  :
          - Validation: Validate the request body fields.
          - Database Interaction: Update the permission in the database.
      `,
  path: `${apiRoutes.permissions}${PermissionPaths.update}`,
  request: {
    query: z.object({ id: z.string() }),
    body: {
      description: 'permission details',
      content: {
        'application/json': {
          schema: UpdatePermissionValidationSchema,
        },
      },
    },
  },
  tags: ['Permission'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'permission updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            permission: UpdatePermissionValidationSchema,
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
      description: 'permission not found',
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

// delete permission

permissionRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing permission  :
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the permission from the database.
      `,
  path: `${apiRoutes.permissions}${PermissionPaths.delete}`,
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Permission'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'permission deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            permission: DeletePermissionValidationSchema,
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
      description: 'permission not found',
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
