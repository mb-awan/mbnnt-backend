import { z } from 'zod';

import { UsernameValidationShema } from '@/api/auth/authSchemas';
import { UserRoles, UserStatus } from '@/common/constants/enums';
import { commonValidations } from '@/common/utils/commonValidation';

const userStatuses: [string, ...string[]] = Object.values(UserStatus) as [string, ...string[]];
const userRoles: [string, ...string[]] = Object.values(UserRoles) as [string, ...string[]];

export const RegisterUserValidationSchema = z
  .object({
    firstName: z.string().optional(),

    lastName: z.string().optional(),

    username: UsernameValidationShema,

    email: z.string().email('Invalid email address'),

    password: commonValidations.password,

    confirmPassword: commonValidations.password,

    phone: z.string().optional(),

    currentAddress: commonValidations.address.optional(),

    postalAddress: commonValidations.address.optional(),

    role: z.enum(userRoles).optional(),

    emailVerified: z.boolean().optional(),

    phoneVerified: z.boolean().optional(),

    passwordUpdateRequested: z.boolean().optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // path of error
    message: 'Passwords must match',
  });

export const GetUsersSearchParamsValidationSchemaWithoutRefine = z
  .object({
    id: z.string().optional(),

    page: z.string().optional(),

    limit: z.string().optional(),

    name: z.string().optional(),

    username: UsernameValidationShema.optional(),

    email: z.string().email().optional(),

    phone: z.string().min(2).optional(),

    status: z.enum(userStatuses).optional(),

    role: commonValidations.validaMongoId.optional(),

    createdAt: z.string().optional(),

    updatedAt: z.string().optional(),
  })
  .strict();

export const GetUsersSearchParamsValidationSchema = GetUsersSearchParamsValidationSchemaWithoutRefine.refine(
  (data) => data.page && parseInt(data.page) > 0,
  { path: ['page'], message: 'Page must be greater than 0' }
).refine((data) => data.limit && parseInt(data.limit) >= 10 && parseInt(data.limit) <= 100, {
  path: ['limit'],
  message: 'Limit must be between 10 and 100',
});

export const UpdateUserValidationSchema = z
  .object({
    id: z.string().optional(),

    firstName: z.string().optional(),

    lastName: z.string().optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),

    role: z.enum(userRoles).optional(),

    status: z.enum(userStatuses).optional(),

    emailVerified: z.boolean().optional(),

    phoneVerified: z.boolean().optional(),

    password: commonValidations.password.optional(),

    currentAddress: commonValidations.address.optional(),

    postalAddress: commonValidations.address.optional(),
  })
  .strict();

export const DeleteUserValidationSchema = commonValidations.userUniqueSearchKeys;

export const BlockUserValidationSchema = commonValidations.userUniqueSearchKeys;
