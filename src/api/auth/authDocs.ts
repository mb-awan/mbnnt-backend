import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { RegisterUserValidationSchema } from './authSchemas';

export const authRegistry = new OpenAPIRegistry();

// Register login path documentation
authRegistry.registerPath({
  method: 'post',
  description: `
    This endpoint allows users to register by providing their information including username, name, contact details, passwords, and addresses:
      - Validation: Validate all fields including username uniqueness, email format, phone number format, password strength, etc.
      - Password Handling: Hash the password securely before storing it.
      - Database Interaction: Save user data to the database.
      - Address Handling: Optionally, validate and save both current and postal addresses.
      - Token Generation: Generate a JWT token and send it in the response.
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

// Register login path documentation
authRegistry.registerPath({
  path: '/auth/login',
  method: 'post',
  description: `
    This endpoint allows users to login by providing their username/email/phone and password:
      - Validation: Validate username and password.
      - Password Handling: Hash the password securely before comparing it with the stored password.
      - Database Interaction: Fetch user data from the database.
      - Token Generation: Generate a JWT token and send it in the response.
  `,
  request: {
    body: {
      description: 'User login details',
      content: {
        'application/json': {
          schema: z.object({
            username: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'User login successful',
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
    401: {
      description: 'Unauthorized: Invalid username or password',
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
