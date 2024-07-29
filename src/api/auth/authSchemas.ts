import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { UserRoles } from '@/common/constants/enums';
import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

const userRoles: [string, ...string[]] = Object.values(UserRoles).filter(
  (role) => role !== UserRoles.ADMIN && role !== UserRoles.SUB_ADMIN
) as [string, ...string[]];

export const RegisterUserValidationSchema = z
  .object({
    username: commonValidations.username,

    firstName: z.string().optional(),

    lastName: z.string().optional(),

    email: z.string().email('Invalid email address'),

    password: commonValidations.password,

    confirmPassword: commonValidations.password,

    role: z.enum(userRoles, { required_error: 'Role is required' }),

    phone: z.string({ required_error: 'Phone number is required' }),

    currentAddress: commonValidations.address.optional(),

    postalAddress: commonValidations.address.optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export const LoginUserValidationSchema = z
  .object({
    username: commonValidations.username.optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),

    password: z
      .string({ required_error: 'Password is Required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

    fromAdminPanel: z.boolean().optional().default(false).describe('to test that the login request is from admin'),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const UsernameValidationShema = z
  .object({
    username: z
      .string({ required_error: 'username is required' })
      .regex(/^[^\sA-Z]*$/, "Username can't contain spaces or uppercase letters")
      .min(3)
      .max(50)
      .optional(),
  })
  .strict();

export const RequestForgotPasswordValidationSchema = z
  .object({
    username: z
      .string({ required_error: 'username is required' })
      .regex(/^[^\sA-Z]*$/, "Username can't contain spaces or uppercase letters")
      .min(3)
      .max(50)
      .optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const VerifyForgotPasswordValidationSchema = z
  .object({
    otp: z.string({ required_error: 'please provide the OTP' }).min(5).max(5),

    username: z
      .string({ required_error: 'username is required' })
      .regex(/^[^\sA-Z]*$/, "Username can't contain spaces or uppercase letters")
      .min(3)
      .max(50)
      .optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const VerifyTwoFactorAuthenticationValidationSchema = z
  .object({
    otp: z.string({ required_error: 'please provide the OTP' }).min(5).max(5),

    username: commonValidations.username.optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const ResendTFAOTPValidationSchema = z
  .object({
    username: commonValidations.username.optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });
