import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  LoginUserValidationSchema,
  OTPValidationSchema,
  RegisterUserValidationSchema,
  RequestForgotPasswordValidationSchema,
  ResendTFAOTPValidationSchema,
  TFAOTPValidationSchema,
  UsernameValidationShema,
  VerifyForgotPasswordValidationSchema,
} from './authSchemas';
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

// login path documentation
authRegistry.registerPath({
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
            success: z.boolean(),
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
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
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
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
  },
});

// verify email

authRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their email using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's email verification status if the OTP is valid.
  `,
  path: '/auth/verify-email',
  tags: ['Auth'],
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

authRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their phone number using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's phone verification status if the OTP is valid.
  `,
  path: '/auth/verify-phone',
  request: {
    query: OTPValidationSchema,
  },
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
authRegistry.registerPath({
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

authRegistry.registerPath({
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

authRegistry.registerPath({
  method: 'get',
  description: `
      This endpoint checks if a username exists:
        - Validation: Ensure the username is provided in the query parameters.
        - Database Interaction: Check if the username already exists in the database.
    `,
  path: '/auth/verify-username',
  request: {
    query: UsernameValidationShema,
  },
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

authRegistry.registerPath({
  method: 'put',
  description: `
      This endpoint requests an OTP for forgotten password:
        - Validation: Ensure the required fields (email or phone number) are provided.
        - OTP Handling: Generate a secure OTP and send it to the user.
        - Database Interaction: Save the OTP in the database associated with the user.
    `,
  path: '/auth/request-forgot-password-otp',
  request: {
    query: RequestForgotPasswordValidationSchema,
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'OTP requested successfully',
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
// verify forget phone otp

authRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint allows users to verify their phone number using an OTP:
      - Validation: Ensure the OTP is correct.
      - Database Interaction: Update the user's phone verification status if the OTP is valid.
  `,
  path: '/auth/verify-forgot-password-otp',
  request: { query: VerifyForgotPasswordValidationSchema },
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

authRegistry.registerPath({
  method: 'post',
  description: `
    Verifies two-factor authentication for a user.
    - Query Parameters: User can be identified by one of username, email, or phone.
    - Body: Contains OTP for verification.
  `,
  path: '/auth/verify-tfa-otp',
  request: {
    query: TFAOTPValidationSchema,
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

authRegistry.registerPath({
  method: 'get',
  path: '/auth/resend-tfa-otp',
  request: {
    query: ResendTFAOTPValidationSchema,
  },
  description: `
    This endpoint allows users to resend the two-factor authentication OTP:
      - Query Parameters: User can be identified by one of username, email, or phone.
      - OTP Generation: Generate and send OTP to the user's email or phone.
  `,
  tags: ['Auth'],
  responses: {
    200: {
      description: 'OTP resent successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'First verify your credentials',
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
    404: {
      description: 'Not found',
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
