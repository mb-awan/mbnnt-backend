// src/emailModel.ts
import mongoose, { Document, Schema } from 'mongoose';

// interface IAttachment {
//   filename: string;
//   path: string;
//   mimeType: string;
// }

interface IEmail extends Document {
  to: string;
  from: string;
  subject: string;
  body: string;
  // cc?: string[];
  // bcc?: string[];
  // attachments?: IAttachment[];
  // sentAt: Date;
  // status: string;
  // priority: string;
}

const emailSchema = new Schema<IEmail>({
  to: { type: String, required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  // cc: { type: [String], default: [] },
  // bcc: { type: [String], default: [] },
  // attachments: { type: [String], default: [] },
  // sentAt: { type: Date, default: Date.now },
  // status: { type: String, default: 'pending' },
  // priority: { type: String, default: 'normal' },
});

const Email = mongoose.model<IEmail>('Email', emailSchema);

export default Email;
