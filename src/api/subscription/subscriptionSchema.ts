import mongoose from 'mongoose';
import { z } from 'zod';

const objectId = z
  .string()
  .min(1)
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const createSubscriptionSchema = z.object({
  user: objectId,
  plan: objectId,
  startDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .transform((value) => new Date(value)),

  endDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .transform((value) => new Date(value)),
  isActive: z.boolean().optional().default(true),
});
