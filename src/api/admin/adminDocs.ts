import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import { userSchema } from '../user/userSchemas';
import { adminPaths } from './adminRoute';
import {
  BlockUserValidationSchema,
  DeleteUserValidationSchema,
  GetUsersSearchParamsValidationSchemaWithoutRefine,
  RegisterUserValidationSchema,
  UpdateUserValidationSchema,
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
  path: `${apiRoutes.admins}${adminPaths.getUsers}`,
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    query: GetUsersSearchParamsValidationSchemaWithoutRefine,
  },
  responses: {
    200: {
      description: 'Users fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            total: z.number(),
            users: z.array(userSchema),
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
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
      description: 'Not Authorized ',
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
            success: z.boolean(),
            error: z.object({}).nullable(),
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
  path: `${apiRoutes.admins}${adminPaths.updateUser}`,
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User update details',
      content: {
        'application/json': {
          schema: UpdateUserValidationSchema,
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
    401: {
      description: 'Not authorized',
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
      description: 'Not found',
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
            success: z.boolean(),
            error: z.object({}).nullable(),
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
           - Request Body: Includes user fields to be blocked.
          - Response: Returns the details of the blocked user.
      `,
  path: `${apiRoutes.admins}${adminPaths.blockUser}`,
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    query: BlockUserValidationSchema,
  },
  responses: {
    200: {
      description: 'User blocked successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
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
    401: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
            success: z.boolean(),
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

adminRegistry.registerPath({
  method: 'delete',
  description: `
    This endpoint allows authenticated admins to delete a user:
      - Authentication: Requires a valid JWT token and admin privileges.
      - Request Body: Includes user fields to be deleted.
      - Response: Returns a message indicating the user was deleted successfully.
  `,
  path: `${apiRoutes.admins}${adminPaths.deleteUser}`,
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    query: DeleteUserValidationSchema,
  },
  responses: {
    200: {
      description: 'User deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            user: userSchema,
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
            success: z.boolean(),
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
            success: z.boolean(),
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
            success: z.boolean(),
          }),
        },
      },
    },
    404: {
      description: 'Not found',
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

adminRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows authenticated admins to create a new user:
          - Authentication: Requires a valid JWT token and admin privileges.
          - Request Body: Includes user fields to be create a new user.
          - Response: Returns a message indicating the user was created successfully, along with user details.
      `,
  path: `${apiRoutes.admins}${adminPaths.createUser}`,
  tags: ['Admin'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User details for registration',
      content: {
        'application/json': {
          schema: RegisterUserValidationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User registration successful',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            token: z.string(),
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
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            responseObject: z.object({}).nullable(),
            statusCode: z.number(),
          }),
        },
      },
    },
    409: {
      description: 'Conflict: User already exists',
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
            success: z.boolean(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});
