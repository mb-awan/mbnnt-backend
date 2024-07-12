import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  images: string[];
  category: mongoose.Types.ObjectId;
  status: 'draft' | 'underReview' | 'approved' | 'declined' | 'published' | 'archived';
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'underReview', 'approved', 'declined', 'published', 'archived'],
    default: 'draft',
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60,
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160,
  },
  keywords: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
