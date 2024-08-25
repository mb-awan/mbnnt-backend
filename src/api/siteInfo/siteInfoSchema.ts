import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

export const GetSiteInfoSeachValidationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().optional(),
});

export const GetSiteInfoValidationSchema = GetSiteInfoSeachValidationSchema.refine(
  (data) => !data?.page || parseInt(data.page) > 0,
  { path: ['page'], message: 'Page must be greater than 0' }
).refine((data) => !data.limit || (parseInt(data.limit) >= 10 && parseInt(data.limit) <= 100), {
  path: ['limit'],
  message: 'Limit must be between 10 and 100',
});

const SocialMediaSchema = z
  .object({
    facebook: z.string().url('Invalid URL'),
    twitter: z.string().url('Invalid URL'),
    linkedin: z.string().url('Invalid URL'),
    instagram: z.string().url('Invalid URL'),
  })
  .strict();

export const SiteInfoSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: commonValidations.address,
  socialLinks: SocialMediaSchema,
  logoUrl: z.string().url('Invalid logo URL'),
});

export const UpdateSiteInfoSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').optional(),
  siteDescription: z.string().min(1, 'Site description is required').optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().min(1, 'Contact phone is required').optional(),
  address: commonValidations.address,
  socialLinks: SocialMediaSchema,
  logoUrl: z.string().url('Invalid logo URL').optional(),
});
