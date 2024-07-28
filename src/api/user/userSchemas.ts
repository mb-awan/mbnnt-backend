import { z } from 'zod';

import { UserRoles, UserStatus } from '@/common/constants/enums';

const addressSchema = z
  .object({
    street: z.string({ required_error: 'Street is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    zip: z.string({ required_error: 'ZIP code is required' }),
  })
  .strict();

export const UpdateUserSchema = z
  .object({
    firstName: z.string().optional(),

    lastName: z.string().optional(),

    username: z.string().optional(),

    currentAddress: addressSchema.optional(),

    postalAddress: addressSchema.optional(),
  })
  .strict();

export const ValidateDeleteUser = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    username: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string(),
  role: z.object({
    id: z.string(),
    name: z.nativeEnum(UserRoles),
    permissions: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })
    ),
  }),
  status: z.nativeEnum(UserStatus),
  phone: z.string(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  profilePicture: z.string().optional(),
});

export const OTPValidationSchema = z
  .object({
    otp: z.string({ required_error: 'OTP Required' }).min(5).max(5),
  })
  .strict();
