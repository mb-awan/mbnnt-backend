import { z } from 'zod';

export const ContactUsSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  message: z.string().min(1, { message: 'Message is required' }),
  images: z.array(z.string().url()).optional(),
  category: z.enum(['complaint', 'review', 'suggestion'], { message: 'Invalid category' }),
});

export const ContactUsSchemaEdit = z.object({
  message: z.string().min(1),
  images: z.array(z.string().url()).optional(),
  category: z.enum(['complaint', 'review', 'suggestion'], { message: 'Invalid category' }),
});
