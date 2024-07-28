import { z } from 'zod';

export const BlogCategoryQuery = z.object({
  page: z.string(),
  limit: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
});

export const BlogCategory = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});
