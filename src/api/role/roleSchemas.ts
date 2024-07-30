import { z } from 'zod';

export const RoleSchema = z.object({
  name: z.string().min(1).optional(),
});

export const editUserRole = z.object({
  roleId: z.string().min(1),
  id: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  username: z
    .string({ required_error: 'username is required' })
    .regex(/^[^\sA-Z]*$/, "Username can't contain spaces or uppercase letters")
    .min(3)
    .max(50)
    .optional(),
});

export const RolePermission = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});
