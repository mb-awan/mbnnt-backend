import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';
import { User } from '@/common/models/user';
import { generateToken, hashPassword } from '@/common/utils/auth';
import { generateOTP } from '@/common/utils/generateOTP';
import { deleteFileFromCloudinary, uploadFileToCloudinary } from '@/common/utils/uploadFile';

// get user
export const getMe = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
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
export const updateMe = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  const id = req.user.id;

  const user = await User.findById(id);
  if (!user || user.status === UserStatus.DELETED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  if (user.status === UserStatus.BLOCKED) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not Authorized' });
  }

  if (req.body.username && !req.body.phone) {
    const alreadyExists = await User.findOne({ username: req.body.username });
    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username already exists' });
    }
  } else if (req.body.phone && !req.body.username) {
    const alreadyExists = await User.findOne({ phone: req.body.phone });
    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Phone number already exists' });
    }
  } else if (req.body.phone && req.body.username) {
    const alreadyExists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }, { phone: req?.body?.phone }],
    });
    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
    }
  }

  const updatedProperties = {};
  Object.keys(req.body).forEach((key) => {
    (updatedProperties as any)[key] = req.body[key];
  });

  const updateUser = await User.findByIdAndUpdate(id, updatedProperties, { new: true }).select('-password -__v');

  return res.status(StatusCodes.OK).json({ user: updateUser });
};

// delete user
export const deleteMe = async (req: Request, res: Response) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }
  const id = req.user.id;

  const user = await User.findByIdAndUpdate(id, { status: 'deleted' }, { new: true }).select('-password -__v');
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }
  if (!(user?.email === req.body.email || user?.username === req.body.username || user?._id === req.body.userId)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized: User cannot delete another user account.' });
  }

  return res.status(StatusCodes.OK).json({ message: 'User Deleted Successfully', user });
};

// update password request

export const updatePasswordRequest = async (req: Request, res: Response) => {
  const id = req?.user?.id;

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

  if (((user.role as any).name as string) === UserRoles.ADMIN) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Admin cannot request password update' });
  }

  if (user.passwordUpdateRequested) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password update already requested' });
  }

  user.passwordUpdateRequested = true;

  await user.save();

  return res.status(StatusCodes.OK).json({ message: 'Password update requested successfully' });
};

// update Password

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const id = req?.user?.id;
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

    const hashedPassword = await hashPassword(req.body.password);
    user.passwordUpdateRequested = false;
    user.password = hashedPassword;

    await user.save();
    return res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Internal Server Error' });
  }
};

// upload profile picture

export const uploadProfilePic = async (req: Request, res: Response) => {
  // POST /users/profile-pic
  const id = req?.user?.id;
  const { file } = req;

  if (!file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User is deleted' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is blocked' });
    }

    const { url } = await uploadFileToCloudinary(file.path);

    const oldProfilePicture = user.profilePicture;
    user.profilePicture = url;
    await user.save();

    if (oldProfilePicture) {
      await deleteFileFromCloudinary(oldProfilePicture);
    }

    res.status(StatusCodes.OK).json({ message: 'Profile picture uploaded successfully', url });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const enableTwoFactorAuthentication = async (req: Request, res: Response) => {
  const id = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Account is Deleted' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is blocked' });
    }
    const otp = generateOTP();
    console.log(otp);
    const hashedOTP = await hashPassword(otp);
    user.TFAOTP = hashedOTP;
    user.TFAEnabled = true;
    const token = await generateToken(user);
    user.accessToken = token;
    await user.save();
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Two-factor authentication enabled successfully' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Error enabling TFA', error: 'Internal server error' });
  }
};

export const disableTwoFactorAuthentication = async (req: Request, res: Response) => {
  const id = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Account is Deleted' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is blocked' });
    }
    user.TFAOTP = '';
    user.TFAEnabled = false;
    user.accessToken = '';
    await user.save();
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Two-factor authentication disabled successfully' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Error disabling TFA', error: 'Internal server error' });
  }
};
