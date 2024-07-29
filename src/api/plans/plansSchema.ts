import { z } from 'zod';

export const getAllPlansSchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
});

export const PlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string(),
});

export const createPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
});

export const updatePlanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.string().min(1),
});
