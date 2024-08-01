import { z } from 'zod';

// Duration Zod schema
const durationSchema = z.object({
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
  description: z.string().min(1, { message: 'Description is required' }),
});

export const PlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string(),
});

export const ValidationPlanQuerySchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
});

export const ValidationPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  duration: durationSchema,
});

export const UpdatePlanValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.string().min(1),
  duration: durationSchema,
});

export const DeletePlanValidationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  duration: durationSchema,
});
