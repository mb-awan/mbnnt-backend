import { z } from 'zod';

export const ValidationFaqQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.enum(['General', 'Billing', 'Technical Support', 'Product']).optional(),
  isActive: z.boolean().optional(),
});

export const ValidationFaqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.enum(['General', 'Billing', 'Technical Support', 'Product']),
  isActive: z.boolean().optional(),
});

export const UpdateFaqValidationSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.enum(['General', 'Billing', 'Technical Support', 'Product']),
  isActive: z.boolean().optional(),
});

export const DeleteFaqValidationSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.enum(['General', 'Billing', 'Technical Support', 'Product']),
  isActive: z.boolean().optional(),
});
