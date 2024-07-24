import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ValidateDeleteUser } from '../user/userSchemas';
import {
  RegisterUserSchema,
  UpdateUserSchema,
  ValidateQueryParamSchema,
  ValidateQueryUserUpdateSchema,
} from './adminSchemas';

export const adminRegistry = new OpenAPIRegistry();

adminRegistry.registerPath({
  method: 'get',
  description: `
  This endpoint allows authenticated admins to fetch a list of users:
    - Authentication: Requires a valid JWT token and admin privileges.
    - Query Parameters: Supports pagination, sorting, and filtering.
    - Response: Returns user details along with pagination information.
`,
  path: '/admin/users',
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],

  request: {
    query: ValidateQueryParamSchema,
  },
  responses: {
    200: {
      description: 'Geting users list',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized ',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
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

adminRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated admins to update user details:
          - Authentication: Requires a valid JWT token and admin privileges.
          - Request Body: Includes user fields to be updated.
          - Response: Returns the updated user details.
      `,
  path: '/admin/user',
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    query: ValidateQueryUserUpdateSchema,
    body: {
      description: 'User update details',
      content: {
        'application/json': {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
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
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
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

adminRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated admins to block a user:
          - Authentication: Requires a valid JWT token and admin privileges.
          - Request Body: Includes user ID, Email, or Username to identify the user to be blocked.
          - Response: Returns the details of the blocked user.
      `,
  path: '/admin/block',
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    query: ValidateDeleteUser,
  },
  responses: {
    200: {
      description: 'User blocked successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input or validation error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
          }),
        },
      },
    },
    404: {
      description: 'User not found',
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

adminRegistry.registerPath({
  method: 'delete',
  description: `
    This endpoint allows authenticated admins to delete a user:
      - Authentication: Requires a valid JWT token and admin privileges.
      - Request Body: Includes user ID, Email, or Username to identify the user to be deleted.
      - Response: Returns a message indicating the user was deleted successfully.
  `,
  path: '/admin/user',
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    query: ValidateDeleteUser,
  },
  responses: {
    200: {
      description: 'User deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input or validation error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
          }),
        },
      },
    },
    404: {
      description: 'User not found',
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

adminRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows authenticated admins to create a new user:
          - Authentication: Requires a valid JWT token and admin privileges.
          - Request Body: Includes username, email, password, role, phone, and name to create a new user.
          - Response: Returns a message indicating the user was created successfully, along with user details.
      `,
  path: '/admin/create-user',
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User details for registration',
      content: {
        'application/json': {
          schema: RegisterUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input or validation error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
          }),
        },
      },
    },
    409: {
      description: 'Conflict: User already exists',
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
