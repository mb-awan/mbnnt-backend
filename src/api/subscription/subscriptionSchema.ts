import { z } from 'zod';

export const ValidationSubscriptionSchema = z.object({
  user: z.string(),
  plan: z.string(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateValidationSubscriptionSchema = z.object({
  user: z.string(),
  plan: z.string(),
  isActive: z.boolean().optional().default(true),
});

export const ValidationSubscriptionQuerySchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
});

export const DeleteValidationSubscriptionSchema = z.object({
  id: z.string(),
});
