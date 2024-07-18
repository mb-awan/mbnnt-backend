import { z } from 'zod';

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
