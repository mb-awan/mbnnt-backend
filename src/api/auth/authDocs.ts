import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import { authPaths } from './authRouter';
import {
  LoginUserValidationSchema,
  RegisterUserValidationSchema,
  RequestForgotPasswordValidationSchema,
  ResendTFAOTPValidationSchema,
  UsernameValidationShema,
  VerifyForgotPasswordValidationSchema,
  VerifyTwoFactorAuthenticationValidationSchema,
} from './authSchemas';

export const authRegistry = new OpenAPIRegistry();

// Register login path documentation
authRegistry.registerPath({
  method: 'post',
  description: `
    This endpoint allows users to register by providing their information for registration:
      - Validation: Validate all fields.
      - Password Handling: Hash the password securely before storing it.
      - Database Interaction: Save user data to the database.
      - Token Generation: Generate a JWT token and send it in the response.
  `,
  path: `${apiRoutes.auth}${authPaths.register}`,
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

// login path documentation
authRegistry.registerPath({
  method: 'post',
  description: `
    This endpoint allows users to login by providing their credentials:
      - Validation: Ensure at least one of email, username, or phone is provided along with the password.
      - Authentication: Verify the user's credentials and generate an access token if valid.
      - Two-Factor Authentication: If TFA is enabled, verify the TFA code.
  `,
  path: `${apiRoutes.auth}${authPaths.login}`,
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
            role: z.string(),
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
    403: {
      description: 'User is blocked',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'Invalid Credentials',
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
            error: z.object({}).nullable(),
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
  path: `${apiRoutes.auth}${authPaths.verifyUsername}`,
  request: {
    query: UsernameValidationShema,
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Username found',
      content: {
        'application/json': {
          schema: z.object({
            exists: z.boolean(),
            message: z.string(),
            success: z.boolean().default(true),
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

// request forget password otp

authRegistry.registerPath({
  method: 'put',
  description: `
      This endpoint requests an OTP for forgotten password:
        - Validation: Ensure the required fields are provided.
        - OTP Handling: Generate a secure OTP and send it to the user.
        - Database Interaction: Save the OTP in the database associated with the user.
    `,
  path: `${apiRoutes.auth}${authPaths.requestForgotPasswordOTP}`,
  request: {
    query: RequestForgotPasswordValidationSchema,
  },
  tags: ['Auth'],
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
    403: {
      description: 'User is blocked',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
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

// verify forget phone otp
authRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint allows users to verify their forgot password request verification OTP:
      - Validation: Ensure the OTP is correct.
      - Token Generation: Generate a JWT token and send it in the response.
  `,
  path: `${apiRoutes.auth}${authPaths.verifyforgotPasswordOTP}`,
  request: { query: VerifyForgotPasswordValidationSchema },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'OTP verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            token: z.string(),
            message: z.string(),
            success: z.boolean().default(true),
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

// verify tfa otp

authRegistry.registerPath({
  method: 'post',
  description: `
    Verifies two-factor authentication for a user.
    - Query Parameters: User can be identified by one of username, email, or phone.
    - Body: Contains OTP for verification.
  `,
  path: `${apiRoutes.auth}${authPaths.verifyTwoFactorAuthentication}`,
  request: {
    query: VerifyTwoFactorAuthenticationValidationSchema,
  },
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Two Factor Authentication verified successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            token: z.string().nullable(),
            TFAEnabled: z.boolean(),
            role: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    404: {
      description: 'Invalid username, email or phone',
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

authRegistry.registerPath({
  method: 'get',
  path: `${apiRoutes.auth}${authPaths.resendTFAOTP}`,
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
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
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
