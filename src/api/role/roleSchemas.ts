import { z } from 'zod';

export const RoleSchema = z.object({
  name: z.string().min(1).optional(),
});
