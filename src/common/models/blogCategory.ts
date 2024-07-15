import { Document, model, Schema } from 'mongoose';

export interface IBlogCategory extends Document {
  name: string;
  description?: string;
}

const BlogCategorySchema = new Schema<IBlogCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
  },
});

export const BlogCategory = model<IBlogCategory>('BlogCategory', BlogCategorySchema);
