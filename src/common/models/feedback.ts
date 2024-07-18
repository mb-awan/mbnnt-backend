import mongoose, { Document, Schema } from 'mongoose';

import { FeedbackTypeEnum } from '../constants/enums';

interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  feedbackType: FeedbackTypeEnum;
  message: string;
  rating: number;
  images: string[];
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    feedbackType: {
      type: String,
      enum: Object.values(FeedbackTypeEnum),
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
