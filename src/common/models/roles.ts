import mongoose, { Document, Schema } from 'mongoose';

interface IRole extends Document {
  name: string;
  permissions: mongoose.Types.ObjectId[];
}

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
    },
  ],
});

export const Role = mongoose.model<IRole>('Role', roleSchema);
