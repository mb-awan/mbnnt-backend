import mongoose, { Document, Schema } from 'mongoose';

import { IAddress } from '../types/users';
import { AddressSchema } from './user';

export interface ISiteInfo extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: IAddress;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  logoUrl: string;
}

const siteInfoSchema = new Schema<ISiteInfo>({
  siteName: {
    type: String,
    required: true,
  },

  siteDescription: {
    type: String,
    required: true,
  },

  contactEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },

  contactPhone: {
    type: String,
    required: true,
  },

  address: AddressSchema,

  socialLinks: {
    facebook: {
      type: String,
      default: '',
    },

    twitter: {
      type: String,
      default: '',
    },

    linkedin: {
      type: String,
      default: '',
    },

    instagram: {
      type: String,
      default: '',
    },
  },

  logoUrl: {
    type: String,
    required: true,
  },
});

export const SiteInfo = mongoose.model<ISiteInfo>('SiteInfo', siteInfoSchema);
