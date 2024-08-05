import { z } from 'zod';

export const ValidateBlogCategoryQuerySchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
});

export const ValidationBlogCategorySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});

export const UpdateBlogCategoryValidationSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});

export const DeleteBlogCategoryValidationSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});
