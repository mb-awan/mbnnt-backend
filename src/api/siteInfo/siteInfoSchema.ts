import { z } from 'zod';

export const SiteInfoSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  logoUrl: z.string().url('Invalid logo URL'),
});

export const UpdateSiteInfoSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').optional(),
  siteDescription: z.string().min(1, 'Site description is required').optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().min(1, 'Contact phone is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  logoUrl: z.string().url('Invalid logo URL').optional(),
});
