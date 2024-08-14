import { z } from 'zod';

// Duration Zod schema
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
  price: z.number().min(1),
  duration: z.number().min(1),
});

export const UpdatePlanValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(1),
  duration: z.number().min(1),
});

export const DeletePlanValidationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1),
  duration: z.number().min(1),
});
