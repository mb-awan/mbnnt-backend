import mongoose, { Document, Schema } from 'mongoose';

import { FaqCategory } from '@/common/constants/enums';
import { faqCategoryEnum } from '@/common/constants/enums';

interface IFaq extends Document {
  question: string;
  answer: string;
  category: FaqCategory;
  isActive: boolean;
}

const faqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: faqCategoryEnum,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FAQ = mongoose.model<IFaq>('FAQ', faqSchema);
