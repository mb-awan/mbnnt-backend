import { z } from 'zod';

export const ValidationContactUsQuerySchema = z.object({
  page: z.string(),
  limit: z.string().optional(),
  id: z.string().optional().optional(),
  name: z.string().trim().min(1, { message: 'Name is required' }).optional(),
  message: z.string().min(1, { message: 'Message is required' }).optional(),
  category: z.enum(['complaint', 'review', 'suggestion'], { message: 'Invalid category' }).optional(),
});

export const ValidationContactUsSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  message: z.string().min(1, { message: 'Message is required' }),
  images: z.array(z.string().url()).optional(),
  category: z.enum(['complaint', 'review', 'suggestion'], { message: 'Invalid category' }),
});

export const UpdateContactUsValidationSchema = z.object({
  message: z.string().min(1),
  images: z.array(z.string().url()).optional(),
  category: z.enum(['complaint', 'review', 'suggestion'], { message: 'Invalid category' }),
});

export const DeleteValidationContactUsSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  message: z.string().min(1, { message: 'Message is required' }),
  images: z.array(z.string().url()).optional(),
  category: z.enum(['complaint', 'review', 'suggestion'], { message: 'Invalid category' }),
});
