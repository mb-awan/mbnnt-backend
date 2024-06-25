import { StatusCodes } from 'http-status-codes';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';

// get user
export const getMe = async (req: any, res: any) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }

  const id = req.user.id;

  const user = await User.findById(id).select('-password -__v');
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }

  if (user.status === UserStatus.DELETED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }

  if (user.status === UserStatus.BLOCKED) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account has been deleted' });
  }

  return res.status(StatusCodes.OK).json({ user });
};

// update user
export const updateMe = async (req: any, res: any) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  const id = req.user.id;

  const user = await User.findById(id);
  if (!user || user.status === UserStatus.DELETED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  if (user.status === UserStatus.BLOCKED) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account is blocked' });
  }

  const updatedProperties = {};
  Object.keys(req.body).forEach((key) => {
    (updatedProperties as any)[key] = req.body[key];
  });

  const updateUser = await User.findByIdAndUpdate(id, updatedProperties, { new: true }).select('-password -__v');

  return res.status(StatusCodes.OK).json({ user: updateUser });
};

// delete user
export const deleteMe = async (req: any, res: any) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }

  const id = req.user.id;

  const user = await User.findByIdAndUpdate(id, { status: 'deleted' }, { new: true }).select('-password -__v');

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  return res.status(StatusCodes.OK).json({ user });
};

// update password request

export const updatePasswordRequest = async (req: any, res: any) => {
  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }

  if (user.status === UserStatus.DELETED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }

  if (user.status === UserStatus.BLOCKED) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account is blocked' });
  }

  if (user.role === UserRoles.ADMIN) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Admin cannot request password update' });
  }

  if (user.passwordUpdateRequested) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password update already requested' });
  }

  user.passwordUpdateRequested = true;

  await user.save();

  return res.status(StatusCodes.OK).json({ message: 'Password update requested successfully' });
};
