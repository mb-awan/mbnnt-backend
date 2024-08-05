import { z } from 'zod';

export const ValidationBlogQuerySchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
  id: z.string().optional(),
  title: z.string().trim().max(100).optional(),
  author: z.string().optional(),
  status: z.enum(['draft', 'underReview', 'approved', 'declined', 'published', 'archived']).default('draft').optional(),
});

export const ValidationBlogSchema = z.object({
  title: z.string().trim().max(100),
  content: z.string(),
  author: z.string(),
  images: z.array(z.string().trim()).optional(),
  category: z.string(),
  status: z.enum(['draft', 'underReview', 'approved', 'declined', 'published', 'archived']).default('draft'),
  tags: z.array(z.string().trim()).optional(),
  metaTitle: z.string().trim().max(60).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  keywords: z.array(z.string().trim()).optional(),
});

export const UpdateBlogValidationSchema = z.object({
  title: z.string().trim().max(100),
  content: z.string(),
  images: z.array(z.string().trim()).optional(),
  tags: z.array(z.string().trim()).optional(),
  metaTitle: z.string().trim().max(60).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  keywords: z.array(z.string().trim()).optional(),
});

export const DeleteBlogValidationSchema = z.object({
  title: z.string().trim().max(100),
  content: z.string(),
  author: z.string(),
  images: z.array(z.string().trim()).optional(),
  category: z.string(),
  status: z.enum(['draft', 'underReview', 'approved', 'declined', 'published', 'archived']).default('draft'),
  tags: z.array(z.string().trim()).optional(),
  metaTitle: z.string().trim().max(60).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  keywords: z.array(z.string().trim()).optional(),
});
