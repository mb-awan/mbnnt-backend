import mongoose, { Document, Schema } from 'mongoose';

interface IContactUs extends Document {
  name: string;
  email: string;
  message: string;
  image: string[];
  category: 'complaint' | 'review' | 'suggestion';
  createdAt: Date;
}

const contactUsSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true },
  image: { type: [String], default: [] },
  category: { type: String, enum: ['complaint', 'review', 'suggestion'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContactUs = mongoose.model<IContactUs>('ContactUs', contactUsSchema);

export default ContactUs;
