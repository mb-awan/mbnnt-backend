import mongoose, { Document, Schema } from 'mongoose';

interface ISubscription extends Document {
  user: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const subscriptionSchema = new Schema<ISubscription>({
  user: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
