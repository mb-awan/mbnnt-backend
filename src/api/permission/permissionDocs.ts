import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { PermissionSchema } from './permissionSchema';
export const permissionRegistry = new OpenAPIRegistry();

// get all permission

permissionRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all permission's  :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all permission's from the database.
  `,
  path: '/permission/get-all-permission',
  tags: ['Permission'],
  responses: {
    200: {
      description: 'permission retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
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
  path: '/permission/get-single-permission',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Permission'],

  responses: {
    200: {
      description: 'permission retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
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
  path: '/permission/create-permission',
  request: {
    body: {
      description: 'permission detail',
      content: {
        'application/json': {
          schema: PermissionSchema,
        },
      },
    },
  },
  tags: ['Permission'],
  responses: {
    201: {
      description: 'permission created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
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
  path: '/permission/edit-permission',
  request: {
    query: z.object({ id: z.string() }),
    body: {
      description: 'permission details',
      content: {
        'application/json': {
          schema: PermissionSchema,
        },
      },
    },
  },
  tags: ['Permission'],
  responses: {
    200: {
      description: 'permission updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
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
  path: '/permission/delete-permission',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Permission'],
  responses: {
    200: {
      description: 'permission deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
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
          }),
        },
      },
    },
  },
});
