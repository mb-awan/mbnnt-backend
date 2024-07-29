import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { UpdatePassword } from '@/common/middleware/user/verification';

import { userPaths } from './userRoutes';
import { DeleteUserValidationSchema, OTPValidationSchema, UpdateUserValidationSchema, userSchema } from './userSchemas';

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
  path: `/user${userPaths.getMe}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'User fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            users: userSchema,
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
// update user profile

userRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint updates the authenticated user's profile information:
      - Authentication: Requires a valid JWT token.
      - Email Verification: Requires the user's email to be verified.
      - Phone Verification: Requires the user's phone number to be verified.
  `,
  path: `/user${userPaths.updateMe}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User profile update details',
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
            message: z.string(),
            user: userSchema,
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

// Delete User

userRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint deletes the authenticated user's account:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the user's email to be verified.
          - Phone Verification: Requires the user's phone number to be verified.
      `,
  path: `/user${userPaths.deleteMe}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'User account deletion details',
      content: {
        'application/json': {
          schema: DeleteUserValidationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            user: userSchema,
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

userRegistry.registerPath({
  method: 'post',
  description: `
    This endpoint allows authenticated users to request a password update:
      - Authentication: Requires a valid JWT token.
      - Email Verification: Requires the user's email to be verified.
      - Phone Verification: Requires the user's phone number to be verified.
  `,
  path: `/user${userPaths.requestUpdatePassword}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Password update request sent successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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

userRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated users to Update their Password:
      - Authentication: Requires a valid JWT token.
      - Status Update: Updates the user's Password .
      `,
  path: `/user${userPaths.updatePassword}`,
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

userRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows authenticated users to upload a profile picture:
          - Authentication: Requires a valid JWT token.
          - File Upload: Accepts a single image file named 'profilePicture'.
          - User Status Checks: Ensures the user is not deleted or blocked.
          - Cloud Storage: Uploads the file to Cloudinary and updates the user's profile picture URL.
      `,
  path: `/user${userPaths.uploadProfilePic}`,
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
              message: z.string(),
              success: z.boolean().default(true),
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
            success: z.boolean().default(false),
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

userRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated users to enable two-factor authentication (TFA):
          - Authentication: Requires a valid JWT token.
          - TFA Setup: Updates the user's record to indicate that TFA is enabled.
      `,
  path: `/user${userPaths.enableTwoFactorAuthentication}`,
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
      description: 'Bad Request ',
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
      description: 'Not authorized ',
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
      description: 'Forbidden ',
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

userRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows authenticated users to disable two-factor authentication (TFA):
          - Authentication: Requires a valid JWT token.
          - TFA Setup: Updates the user's record to indicate that TFA is disabled.
      `,
  path: `/user${userPaths.disableTwoFactorAuthentication}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Two-factor authentication disabled successfully',
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
      description: 'Bad Request ',
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
      description: 'Not authorized ',
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
      description: 'Forbidden ',
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

// generate email verification otp
userRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint generates an OTP for email verification:
      - Authentication: User must be authenticated.
      - OTP Generation: Generate and send OTP to the user's email.
  `,
  path: `/user${userPaths.requestEmailVerificationOtp}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'OTP sent successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
          }),
        },
      },
    },
    400: {
      description: 'Invalid Input',
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
      description: 'Invalid Token',
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
      description: 'User is blocked',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    404: {
      description: 'Not Found',
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

// verify email
userRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their email using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's email verification status if the OTP is valid.
  `,
  path: `/user${userPaths.verifyEmail}`,
  tags: ['User'],
  request: {
    query: OTPValidationSchema,
  },
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Email verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
          }),
        },
      },
    },
    400: {
      description: 'Invalid OTP',
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
            message: z.string(),
            success: z.boolean().default(false),
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

// generate phone verification otp
userRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint generates an OTP for phone verification:
      - Authentication: User must be authenticated.
      - OTP Generation: Generate and send OTP to the user's phone.
  `,
  path: `/user${userPaths.requestEmailVerificationOtp}`,
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'OTP generated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
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
      description: 'Not Authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    404: {
      description: 'Not Found',
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

// verify phone
userRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their phone number using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's phone verification status if the OTP is valid.
  `,
  path: `/user${userPaths.verifyPhone}`,
  request: {
    query: OTPValidationSchema,
  },
  tags: ['User'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Phone verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
          }),
        },
      },
    },
    400: {
      description: 'Invalid OTP',
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
            message: z.string(),
            success: z.boolean().default(false),
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
