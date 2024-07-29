import { z } from 'zod';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { commonValidations } from '@/common/utils/commonValidation';

export const UpdateUserValidationSchema = z
  .object({
    firstName: z.string().optional(),

    lastName: z.string().optional(),

    username: commonValidations.username.optional(),

    currentAddress: commonValidations.address.optional(),

    postalAddress: commonValidations.address.optional(),
  })
  .strict();

export const DeleteUserValidationSchema = commonValidations.userUniqueSearchKeys;

export const userSchema = z.object({
  id: z.string(),

  firstName: z.string().optional(),

  lastName: z.string().optional(),

  username: commonValidations.username,

  email: z.string(),

  role: z.object({
    id: commonValidations.validaMongoId,
    name: z.nativeEnum(UserRoles),
  }),

  status: z.nativeEnum(UserStatus),

  phone: z.string(),

  address: commonValidations.address,

  emailVerified: z.boolean(),

  phoneVerified: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),

  profilePicture: z.string().url().optional(),
});

export const OTPValidationSchema = z
  .object({
    otp: z.string({ required_error: 'OTP Required' }).min(5).max(5),
  })
  .strict();
