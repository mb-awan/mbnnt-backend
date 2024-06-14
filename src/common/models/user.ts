import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },

  emailVerifies: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'active',
  },
});

const User = mongoose.model('User', userSchema);
export { User };
