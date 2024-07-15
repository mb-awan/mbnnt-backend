import { z } from 'zod';

export const PermissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
