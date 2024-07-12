import mongoose, { Schema } from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  subscribers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
