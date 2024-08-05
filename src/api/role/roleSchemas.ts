import { z } from 'zod';

export const ValidationQueryRoleSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export const ValdationRoleSchema = z.object({
  name: z.string().min(1),
});

export const UpdateValidationRoleSchema = z.object({
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

export const DeleteValdationRoleSchema = z.object({
  name: z.string().min(1).optional(),
});

export const ValidationRolePermissionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const ValidationUserRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});
