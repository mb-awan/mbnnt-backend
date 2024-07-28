import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { userSchema } from '../user/userSchemas';
import { editUserRole, RolePermission, RoleSchema } from './roleSchemas';
export const roleRegistry = new OpenAPIRegistry();

// get all role

roleRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all role's  :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all role's from the database.
  `,
  path: '/role/get-all-roles',
  tags: ['Role'],
  responses: {
    200: {
      description: 'roles retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            totalItems: z.number(),
            roles: z.array(RoleSchema),
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

// get single role

roleRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single role by its ID:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Fetch a role from the database.
      `,
  path: '/role/get-single-role',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Role'],

  responses: {
    200: {
      description: 'role retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'role not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.number(),
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

// create role

roleRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new role :
          - Validation: Validate the request body fields.
          - Database Interaction: Save the new role to the database.
      `,
  path: '/role/create-role',
  request: {
    body: {
      description: 'role detail',
      content: {
        'application/json': {
          schema: RoleSchema,
        },
      },
    },
  },
  tags: ['Role'],
  responses: {
    201: {
      description: 'role created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.number(),
            role: RoleSchema,
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
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).optional(),
          }),
        },
      },
    },
  },
});

// update role

roleRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing role  :
          - Validation: Validate the request body fields.
          - Database Interaction: Update the role in the database.
      `,
  path: '/role/edit-role',
  request: {
    query: z.object({ id: z.string() }),
    body: {
      description: 'role details',
      content: {
        'application/json': {
          schema: RoleSchema,
        },
      },
    },
  },
  tags: ['Role'],
  responses: {
    200: {
      description: 'role updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            role: RoleSchema,
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
            error: z.object({}).optional(),
          }),
        },
      },
    },
  },
});

// delete role

roleRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing role  :
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the role  from the database.
      `,
  path: '/role/delete-role',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Role'],
  responses: {
    200: {
      description: 'role deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
      description: 'role not found',
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
            error: z.object({}).optional(),
          }),
        },
      },
    },
  },
});

// edit role permission

roleRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing role Permission:
          - Validation: Validate the request body fields.
          - Database Interaction: Update the role permission in the database.
      `,
  path: '/role/edit-role-permission',
  request: {
    query: z.object({ id: z.string() }),
    body: {
      description: 'role details',
      content: {
        'application/json': {
          schema: RolePermission,
        },
      },
    },
  },
  tags: ['Role'],
  responses: {
    200: {
      description: 'role permission updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            permission: RolePermission,
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
      description: 'role not found',
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
            error: z.object({}).optional(),
          }),
        },
      },
    },
  },
});

//  edit user role

roleRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing user role:
          - Validation: Validate the request body fields.
          - Database Interaction: Update the user role in the database.
      `,
  path: '/role/edit-user-role',
  request: {
    query: editUserRole,
    body: {
      description: 'role details',
      content: {
        'application/json': {
          schema: RoleSchema,
        },
      },
    },
  },
  tags: ['Role'],
  responses: {
    200: {
      description: 'role user permission updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            user: userSchema,
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
      description: 'role not found',
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
            error: z.object({}).optional(),
          }),
        },
      },
    },
  },
});
