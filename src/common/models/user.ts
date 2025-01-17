import mongoose from 'mongoose';

import { UserStatus } from '../constants/enums';
import { IUserDoc } from '../types/users';

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

  country: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    username: {
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
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
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
      nullable: true,
      default: null,
    },

    forgotPasswordOTP: {
      type: String,
      default: null,
    },

    accessToken: {
      type: String,
      default: null,
    },

    TFAEnabled: {
      type: Boolean,
      default: false,
    },

    TFAOTP: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUserDoc>('User', userSchema);
export { User };
