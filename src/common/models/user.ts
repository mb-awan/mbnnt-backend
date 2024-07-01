import mongoose from 'mongoose';

import { UserRoles, UserStatus } from '../constants/enums';

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  street: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  zip: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
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

    password: {
      type: String,
      required: true,
    },

    passwordUpdateRequested: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRoles),
      required: true,
      default: UserRoles.VISITOR,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      required: true,
      default: UserStatus.ACTIVE,
    },

    phone: {
      type: String,
    },

    currentAddress: {
      type: AddressSchema,
      required: false,
    },

    postalAddress: {
      type: AddressSchema,
      required: false,
    },

    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    profilePicture: {
      type: String,
      required: false,
    },

    emailVerificationOTP: {
      type: String,
      default: null,
    },

    phoneVerificationOTP: {
      type: String,
      default: null,
    },
    forgotPasswordOTP: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export { User };
