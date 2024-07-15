import { z } from 'zod';

export const zodBlogCategory = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});
