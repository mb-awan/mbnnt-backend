import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';
import { User } from '@/common/models/user';
import { hashPassword } from '@/common/utils/auth';
import { APIResponse } from '@/common/utils/response';
import { deleteFileFromCloudinary, uploadFileToCloudinary } from '@/common/utils/uploadFile';

// get user
export const getMe = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  const id = req.user.id;

  const user = await User.findById(id)
    .populate({
      path: 'role',
      select: '-__v',
      populate: { path: 'permissions', model: Permission, select: '-__v' },
    })
    .select('-password -__v');

  if (!user) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  if (user.status === UserStatus.DELETED) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  if (user.status === UserStatus.BLOCKED) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.FORBIDDEN);
  }

  return APIResponse.success(res, 'User fetched successfully', { user });
};

// update user
export const updateMe = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  const id = req.user.id;

  const user = await User.findById(id);
  if (!user || user.status === UserStatus.DELETED) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  if (user.status === UserStatus.BLOCKED) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.FORBIDDEN);
  }

  if (req.body.username && !req.body.phone) {
    const alreadyExists = await User.findOne({ username: req.body.username });
    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return APIResponse.error(res, 'Username already exists', null, StatusCodes.BAD_REQUEST);
    }
  } else if (req.body.phone && !req.body.username) {
    const alreadyExists = await User.findOne({ phone: req.body.phone });
    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return APIResponse.error(res, 'Phone number already exists', null, StatusCodes.BAD_REQUEST);
    }
  } else if (req.body.phone && req.body.username) {
    const alreadyExists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }, { phone: req?.body?.phone }],
    });
    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return APIResponse.error(res, 'User already exists', null, StatusCodes.BAD_REQUEST);
    }
  }

  const updatedProperties = {};
  Object.keys(req.body).forEach((key) => {
    (updatedProperties as any)[key] = req.body[key];
  });

  const updateUser = await User.findByIdAndUpdate(id, updatedProperties, { new: true }).select('-password -__v');

  return APIResponse.success(res, 'User updated successfully', { user: updateUser });
};

// delete user
export const deleteMe = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }
  const id = req.user.id;

  const user = await User.findByIdAndUpdate(id, { status: 'deleted' }, { new: true }).select('-password -__v');
  if (!user) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }
  if (!(user?.email === req.body.email || user?.username === req.body.username || user?._id === req.body.userId)) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  return APIResponse.success(res, 'User deleted successfully', { user });
};

// update password request

export const updatePasswordRequest = async (req: Request, res: Response) => {
  const id = req?.user?.id;

  const user = await User.findById(id);

  if (!user) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  if (user.status === UserStatus.DELETED) {
    return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
  }

  if (user.status === UserStatus.BLOCKED) {
    return APIResponse.error(res, 'This account is blocked', null, StatusCodes.FORBIDDEN);
  }

  if (((user.role as any).name as string) === UserRoles.ADMIN) {
    return APIResponse.error(res, 'Admins cannot update password', null, StatusCodes.FORBIDDEN);
  }

  if (user.passwordUpdateRequested) {
    return APIResponse.error(res, 'Password update already requested', null, StatusCodes.BAD_REQUEST);
  }

  user.passwordUpdateRequested = true;

  await user.save();

  return APIResponse.success(res, 'Password update request sent successfully');
};

// update Password

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const id = req?.user?.id;
    const user = await User.findById(id);
    if (!user) {
      return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
    }
    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'Not authorized', null, StatusCodes.UNAUTHORIZED);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    const hashedPassword = await hashPassword(req.body.password);
    user.passwordUpdateRequested = false;
    user.password = hashedPassword;

    await user.save();
    return APIResponse.success(res, 'Password updated successfully');
  } catch (err) {
    console.log(err);
    return APIResponse.error(res, 'Internal server error', err, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// upload profile picture

export const uploadProfilePic = async (req: Request, res: Response) => {
  // POST /users/profile-pic
  const id = req?.user?.id;
  const { file } = req;

  if (!file) {
    return APIResponse.error(res, 'Please upload a file', null, StatusCodes.BAD_REQUEST);
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.UNAUTHORIZED);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    const { url } = await uploadFileToCloudinary(file.path);

    const oldProfilePicture = user.profilePicture;
    user.profilePicture = url;
    await user.save();

    if (oldProfilePicture) {
      await deleteFileFromCloudinary(oldProfilePicture);
    }

    return APIResponse.success(res, 'Profile picture uploaded successfully', { profilePicture: url });
  } catch (error) {
    console.log(error);
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const enableTwoFactorAuthentication = async (req: Request, res: Response) => {
  const id = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }
    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'Account not found', null, StatusCodes.UNAUTHORIZED);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    user.TFAEnabled = true;

    await user.save();
    return APIResponse.success(res, 'Two-factor authentication enabled successfully');
  } catch (error) {
    console.error('Error while enabling TFA', error);
    return APIResponse.error(res, 'Error enabling TFA', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const disableTwoFactorAuthentication = async (req: Request, res: Response) => {
  const id = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }
    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'Account not found', null, StatusCodes.UNAUTHORIZED);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    user.TFAOTP = '';
    user.TFAEnabled = false;

    await user.save();
    return APIResponse.success(res, 'Two-factor authentication disabled successfully');
  } catch (error) {
    console.error('Error while diabling TFA:', error);
    return APIResponse.error(res, 'Error disabling TFA', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
