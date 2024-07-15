import { z } from 'zod';

export const blogSchema = z.object({
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

export const blogSchemaEdit = z.object({
  title: z.string().trim().max(100),
  content: z.string(),
  images: z.array(z.string().trim()).optional(),
  status: z.enum(['draft', 'underReview', 'approved', 'declined', 'published', 'archived']).default('draft'),
  tags: z.array(z.string().trim()).optional(),
  metaTitle: z.string().trim().max(60).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  keywords: z.array(z.string().trim()).optional(),
});
