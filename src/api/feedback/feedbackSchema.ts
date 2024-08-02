import mongoose from 'mongoose';
import { z } from 'zod';

const feedbackTypeEnum = ['Complaint', 'Review', 'Suggestion'] as const;

export const ValidationFeedbackQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  feedbackType: z.enum(feedbackTypeEnum).optional(),
  email: z.string().email().optional(),
  id: z.string().optional(),
});

export const ValidationfeedbackSchema = z.object({
  userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid user ID',
  }),
  email: z.string().email(),
  feedbackType: z.enum(feedbackTypeEnum),
  message: z.string().min(1, { message: 'Message is required' }),
  rating: z.number().min(1).max(5),
  images: z.array(z.string().trim()).optional(),
});

// export type FeedbackInput = z.infer<typeof ValidationfeedbackSchema>;

export const UpdatefeedbackValidationSchema = z.object({
  feedbackType: z.enum(feedbackTypeEnum).optional(),
  message: z.string().min(1, { message: 'Message is required' }),
  rating: z.number().min(1).max(5),
  images: z.array(z.string().trim()).optional(),
});

// export type feedbackSchemaEdit = z.infer<typeof ValidationfeedbackSchema>;

export const DeletefeedbackValidationSchema = z.object({
  userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid user ID',
  }),
  email: z.string().email(),
  feedbackType: z.enum(feedbackTypeEnum),
  message: z.string().min(1, { message: 'Message is required' }),
  rating: z.number().min(1).max(5),
  images: z.array(z.string().trim()).optional(),
});
