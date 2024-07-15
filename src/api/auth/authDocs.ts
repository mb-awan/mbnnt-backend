import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { RegisterUserValidationSchema } from './authSchemas';

export const authRegistry = new OpenAPIRegistry();

authRegistry.registerPath({
  method: 'post',
  description: `
    This endpoint allows users to register by providing their information including username, name, contact details, passwords, and addresses:
      - Validation: Validate all fields including username uniqueness, email format, phone number format, password strength, etc.
      - Password Handling: Hash the password securely before storing it.
      - Database Interaction: Save user data to the database.
      - Address Handling: Optionally, validate and save both current and postal addresses.
  `,
  path: '/auth/register',
  request: {
    body: {
      description: 'User registration details',
      content: {
        'application/json': {
          schema: RegisterUserValidationSchema,
        },
      },
    },
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'User registration successful',
      content: {
        'application/json': {
          schema: z.object({
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
