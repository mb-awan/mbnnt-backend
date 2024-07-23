import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { LoginUserValidationSchema, RegisterUserValidationSchema } from './authSchemas';
export const authRegistry = new OpenAPIRegistry();
export const authLogin = new OpenAPIRegistry();
export const authEmaillVerify = new OpenAPIRegistry();
export const authGenerateEmailOTP = new OpenAPIRegistry();
export const authVerifyPhoneOTP = new OpenAPIRegistry();
export const authGeneratePhoneOTP = new OpenAPIRegistry();
export const authVerifyUserName = new OpenAPIRegistry();
export const authRequestForgetPasswordOTP = new OpenAPIRegistry();
export const authVerifyForgetPasswordOTP = new OpenAPIRegistry();
export const authVerifyTwoFactorAuthentication = new OpenAPIRegistry();

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

// login

authLogin.registerPath({
  method: 'post',
  description: `
    This endpoint allows users to log in by providing their credentials:
      - Validation: Ensure at least one of email, username, or phone is provided along with the password.
      - Authentication: Verify the user's credentials and generate an access token if valid.
      - Two-Factor Authentication: If TFA is enabled, verify the TFA code.
  `,
  path: '/auth/login',
  request: {
    body: {
      description: 'User login details',
      content: {
        'application/json': {
          schema: LoginUserValidationSchema,
        },
      },
    },
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Logged in successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            token: z.string().nullable(),
            TFAEnabled: z.boolean(),
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
      description: 'Unauthorized: Invalid credentials',
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

// verify email

authEmaillVerify.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their email using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's email verification status if the OTP is valid.
  `,
  path: '/auth/verify-email',
  parameters: [
    {
      name: 'otp',
      in: 'query',
      required: true,
      description: 'OTP to verify Email OTP',
      schema: {
        type: 'object',
        properties: {
          otp: {
            type: 'string',
            description: 'The Email to verify',
            minLength: 5,
          },
        },
        required: ['otp'],
      },
    },
  ],
  tags: ['Auth'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Email verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid OTP',
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

// verify phone

authVerifyPhoneOTP.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their phone number using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's phone verification status if the OTP is valid.
  `,
  path: '/auth/verify-phone',
  parameters: [
    {
      name: 'otp',
      in: 'query',
      required: true,
      description: 'OTP to verify Phone OTP',
      schema: {
        type: 'object',
        properties: {
          otp: {
            type: 'string',
            description: 'The Phone to verify',
            minLength: 5,
          },
        },
        required: ['otp'],
      },
    },
  ],
  tags: ['Auth'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Phone verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid OTP',
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

// generate email verification otp

authGenerateEmailOTP.registerPath({
  method: 'put',
  description: `
    This endpoint generates an OTP for email verification:
      - Authentication: User must be authenticated.
      - OTP Generation: Generate and send OTP to the user's email.
  `,
  path: '/auth/generate-email-verification-otp',
  tags: ['Auth'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'OTP generated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
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

// generate phone verification otp

authGeneratePhoneOTP.registerPath({
  method: 'put',
  description: `
    This endpoint generates an OTP for phone verification:
      - Authentication: User must be authenticated.
      - OTP Generation: Generate and send OTP to the user's phone.
  `,
  path: '/auth/generate-phone-verification-otp',
  tags: ['Auth'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'OTP generated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
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

// verify username

authVerifyUserName.registerPath({
  method: 'get',
  description: `
      This endpoint checks if a username exists:
        - Validation: Ensure the username is provided in the query parameters.
        - Database Interaction: Check if the username already exists in the database.
    `,
  path: '/auth/verify-username',
  parameters: [
    {
      name: 'username',
      in: 'query',
      required: true,
      description: 'OTP to verify Phone',
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'The username to verify',
            minLength: 3,
          },
        },
        required: ['username'],
      },
    },
  ],
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Username verification status',
      content: {
        'application/json': {
          schema: z.object({
            exists: z.boolean(),
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
  },
});

// request forget password otp

authRequestForgetPasswordOTP.registerPath({
  method: 'put',
  description: `
      This endpoint requests an OTP for forgotten password:
        - Validation: Ensure the required fields (email or phone number) are provided.
        - OTP Handling: Generate a secure OTP and send it to the user.
        - Database Interaction: Save the OTP in the database associated with the user.
    `,
  path: '/auth/request-forgot-password-otp',
  parameters: [
    {
      name: 'Forgot Password OTP Request',
      in: 'query',
      required: true,
      description: 'Enter your Email || UserName || Phone',
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Username to request OTP for Forgot Password',
          },
          phone: {
            type: 'string',
            description: 'Phone number to request OTP for Forgot Password',
          },
          email: {
            type: 'string',
            description: 'Email address to request OTP for Forgot Password',
          },
        },
        oneOf: [{ required: ['username'] }, { required: ['phone'] }, { required: ['email'] }],
      },
    },
  ],
  tags: ['Auth'],
  responses: {
    200: {
      description: 'OTP requested successfully',
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

// verify forget phone otp

authVerifyForgetPasswordOTP.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their phone number using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's phone verification status if the OTP is valid.
  `,
  path: '/auth/verify-forgot-password-otp',
  parameters: [
    {
      name: 'otp',
      in: 'query',
      required: true,
      description: 'OTP to verify Forgot Phone OTP',
      schema: {
        type: 'object',
        properties: {
          otp: {
            type: 'string',
            description: 'To verify forgot phone OTP',
            minLength: 5,
          },
        },
        required: ['otp'],
      },
    },
  ],
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Phone verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid OTP',
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
  },
});

authVerifyTwoFactorAuthentication.registerPath({
  method: 'post',
  description: `
    Verifies two-factor authentication for a user.
    - Query Parameters: User can be identified by one of username, email, or phone.
    - Body: Contains OTP for verification.
  `,
  path: '/auth/verify-tfa-otp',
  parameters: [
    {
      name: 'Two Factor Authentication',
      in: 'query',
      required: true,
      description: 'Verify the two-factor authentication Enter Username Phone aur UserName one of them',
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Username of the user',
          },
          email: {
            type: 'string',
            description: 'Email address of the user',
          },
          phone: {
            type: 'string',
            description: 'Phone number of the user',
          },
        },
        oneOf: [{ required: ['username'] }, { required: ['email'] }, { required: ['phone'] }],
        description: 'One of username, email, or phone must be provided',
      },
    },
  ],
  request: {
    body: {
      description: 'Request body containing OTP for verification',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              otp: {
                type: 'string',
                description: 'The OTP to verify',
              },
            },
            required: ['otp'],
          },
        },
      },
    },
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'OTP requested successfully',
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
