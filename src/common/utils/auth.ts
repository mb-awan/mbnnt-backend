import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { IUser } from '@/common/types/users';

import { UserRoles } from '../constants/enums';
import { User } from '../models/user';
import { env } from './envConfig';

const { JWT_SECRET_KEY, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS } = env;

export const generateToken = (user: any) => {
  const payload: IUser = {
    id: user._id.toString(),
    email: user.email,
    role: {
      id: user.role._id.toString(),
      name: user.role.name as UserRoles,
    },
    status: user.status,
    phone: user.phone,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET_KEY);

  return decoded;
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  return hashedPassword;
};

export const isValidPassword = async (password: string, hashedPassword: string) => {
  const validPassword = await bcrypt.compare(password, hashedPassword);

  return validPassword;
};

export const hashOTP = async (otp: string) => {
  const hashedOTP = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);

  return hashedOTP;
};

export const isValidOTP = async (otp: string, hashedOTP: string) => {
  const validOTP = await bcrypt.compare(otp, hashedOTP);

  return validOTP;
};

interface IGetUserByIdOrEmailOrUsernameOrPhone {
  id?: string;
  email?: string;
  username?: string;
  phone?: string;
}

export const getUserByIdOrEmailOrUsernameOrPhone = async (params: IGetUserByIdOrEmailOrUsernameOrPhone) => {
  const { id, email, username, phone } = params;
  const user = await User.findOne({
    $or: [{ email }, { username }, { phone, phoneVerified: true }, { _id: id }],
  }).select('-password -__v ');

  return user;
};
