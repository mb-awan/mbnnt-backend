// src/emailValidation.ts
import { z } from 'zod';

export const validationEmailSchema = z.object({
  to: z.string().email(),
  from: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z.array(z.string()).optional(),
  sentAt: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .transform((value) => new Date(value)),
  status: z.enum(['pending', 'sent', 'failed']).default('pending'),
  priority: z.enum(['high', 'normal', 'low']).default('normal'),
});

export const validationEmailUpdateSchema = z.object({
  to: z.string().email().optional(),
  from: z.string().email().optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z.array(z.string()).optional(),
  sentAt: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .transform((value) => new Date(value)),
  status: z.enum(['pending', 'sent', 'failed']).optional(),
  priority: z.enum(['high', 'normal', 'low']).optional(),
});

export const validationEmailQuerySchema = z.object({
  page: z.string().min(1),
  limit: z.string().min(1).optional(),
});

export const deleteEmailValidationSchema = z.object({
  to: z.string().email().optional(),
  from: z.string().email().optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
});
