import { z } from 'zod';

export const newsletterSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  content: z.string({ required_error: 'Content is required' }),
  author: z.string({ required_error: 'Author is required' }),
  subscribers: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});
