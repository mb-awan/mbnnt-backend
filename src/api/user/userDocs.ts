import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { UpdatePassword } from '@/common/middleware/user/verification';

import { UpdateUserSchema, ValidateDeleteUser } from './userSchemas';

export const userRegistry = new OpenAPIRegistry();

// user Details

userRegistry.registerPath({
  method: 'get',
  description: `
      This endpoint retrieves the authenticated user's profile information:
      - Authentication: Requires a valid JWT token.
      - Email Verification: Requires the user's email to be verified.
      - Phone Verification: Requires the user's phone number to be verified.
      `,
  path: '/user/me',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Successfull response',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid Token',
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
// update user profile

userRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint updates the authenticated user's profile information:
      - Authentication: Requires a valid JWT token.
      - Email Verification: Requires the user's email to be verified.
      - Phone Verification: Requires the user's phone number to be verified.
  `,
  path: '/user/me',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User profile update details',
      content: {
        'application/json': {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfull response',
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

// Delete User

userRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint deletes the authenticated user's account:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the user's email to be verified.
          - Phone Verification: Requires the user's phone number to be verified.
      `,
  path: '/user/me',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User account deletion details',
      content: {
        'application/json': {
          schema: ValidateDeleteUser,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User account deleted successfully',
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

userRegistry.registerPath({
  method: 'post',
  description: `
    This endpoint allows authenticated users to request a password update:
      - Authentication: Requires a valid JWT token.
      - Email Verification: Requires the user's email to be verified.
      - Phone Verification: Requires the user's phone number to be verified.
  `,
  path: '/user/me/update-password-request',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Password update request successful',
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

userRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows authenticated users to upload a profile picture:
          - Authentication: Requires a valid JWT token.
          - File Upload: Accepts a single image file named 'profilePicture'.
          - User Status Checks: Ensures the user is not deleted or blocked.
          - Cloud Storage: Uploads the file to Cloudinary and updates the user's profile picture URL.
      `,
  path: '/user/me/profile-pic',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'Profile picture upload',
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              profilePicture: {
                type: 'string',
                format: 'binary',
              },
            },
            required: ['profilePicture'],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile picture uploaded successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: z.object({
              profilePicture: z.string(),
            }),
          }),
        },
      },
    },
    400: {
      description: 'No file uploaded or invalid file format',
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

userRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated users to Update their Password:
      - Authentication: Requires a valid JWT token.
      - Status Update: Updates the user's Password .
      `,
  path: '/user/me/update-password',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'Update password details',
      content: {
        'application/json': {
          schema: UpdatePassword,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input or request validation error',
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

userRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated users to enable two-factor authentication (TFA):
          - Authentication: Requires a valid JWT token.
          - TFA Setup: Updates the user's record to indicate that TFA is enabled.
      `,
  path: '/user/me/enable-tfa',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Two-factor authentication enabled successfully',
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

userRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated users to disable two-factor authentication (TFA):
          - Authentication: Requires a valid JWT token.
          - TFA Setup: Updates the user's record to indicate that TFA is disabled.
      `,
  path: '/user/me/disable-tfa',
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Two-factor authentication enabled successfully',
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
