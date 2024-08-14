import { z } from 'zod';

export const ValidationPermissionQuerySchema = z.object({
  page: z.string(),
  limt: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const ValidationPermissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const UpdatePermissionValidationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const DeletePermissionValidationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
