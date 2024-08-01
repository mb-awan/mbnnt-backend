import { z } from 'zod';

export const ValidationNewsLetterQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
});

export const ValidationNewsletterSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  content: z.string({ required_error: 'Content is required' }),
  author: z.string({ required_error: 'Author is required' }),
  subscribers: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const UpdatedNewsletterSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  content: z.string({ required_error: 'Content is required' }),
  author: z.string({ required_error: 'Author is required' }),
  subscribers: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const DeleteNewsletterValidationSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  content: z.string({ required_error: 'Content is required' }),
  author: z.string({ required_error: 'Author is required' }),
  subscribers: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});
