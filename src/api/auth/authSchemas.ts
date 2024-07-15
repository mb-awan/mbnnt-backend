import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { UserRoles } from '@/common/constants/enums';

extendZodWithOpenApi(z);

const AddressValidateSchema = z
  .object({
    street: z.string({ required_error: 'Street is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    zip: z.string({ required_error: 'ZIP code is required' }),
  })
  .strict();

const userRoles: [string, ...string[]] = Object.values(UserRoles).filter(
  (role) => role !== UserRoles.ADMIN && role !== UserRoles.SUB_ADMIN
) as [string, ...string[]];

export const RegisterUserValidationSchema = z
  .object({
    username: z.string({ required_error: 'username is required' }),

    firstName: z.string().optional(),

    lastName: z.string().optional(),

    email: z.string().email('Invalid email address'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(8, 'Confirm password must be at least 8 characters long')
      .regex(/[a-z]/, 'Confirm password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Confirm password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Confirm password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Confirm password must contain at least one special character'),

    role: z.enum(userRoles, { required_error: 'Role is required' }),

    phone: z.string({ required_error: 'Phone number is required' }),

    currentAddress: AddressValidateSchema.optional(),

    postalAddress: AddressValidateSchema.optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export const LoginUserValidationSchema = z
  .object({
    username: z.string().min(3).max(50).optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),

    password: z
      .string({ required_error: 'Password is Required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });

export const OTPValidationSchema = z
  .object({
    otp: z.string({ required_error: 'OTP Required' }).min(5).max(5),
  })
  .strict();

export const UsernameValidationShema = z
  .object({
    username: z.string({ required_error: 'Username Required' }).min(3).max(10),
  })
  .strict();

export const RequestForgotPasswordValidationSchema = z
  .object({
    username: z.string().min(3).max(50).optional(),

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

    username: z.string().min(3).max(50).optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.username || data.phone, {
    path: ['username', 'email', 'phone'],
    message: 'At least one of email, username, or phone must be provided',
  });
