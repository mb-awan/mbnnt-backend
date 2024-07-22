import mongoose, { Document, ObjectId, Schema } from 'mongoose';

import { NotificationTypes } from '../constants/enums';
import { IUserDoc } from '../types/users';

export interface INotification {
  user: ObjectId | IUserDoc;
  type: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
}

interface INotificationDoc extends Document, INotification {}

const notificationSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NotificationTypes, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: false }, // Additional data related to the notification
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.updatedAt = Date.now();
  return this.save();
};

const Notification = mongoose.model<INotificationDoc>('notification', notificationSchema);

export default Notification;
