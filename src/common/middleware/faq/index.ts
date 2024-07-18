import { z } from 'zod';

export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.enum(['General', 'Billing', 'Technical Support', 'Product']),
  isActive: z.boolean().optional(),
});
