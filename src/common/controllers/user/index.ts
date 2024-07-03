import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { Upload } from '@/common/middleware/user/uploadProfilePic';
import { User } from '@/common/models/user';
import { hashPassword } from '@/common/utils/auth';
import { generateOTP } from '@/common/utils/generateOTP';
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
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not Authorized' });
  }

  if (req.body.username && !req.body.phone) {
    const alreadyExists = await User.findOne({ username: req.body.username });
    if (alreadyExists && alreadyExists._id !== id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username already exists' });
    }
  } else if (req.body.phone && !req.body.username) {
    const alreadyExists = await User.findOne({ phone: req.body.phone });
    if (alreadyExists && alreadyExists._id !== id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Phone number already exists' });
    }
  } else if (req.body.phone && req.body.username) {
    const alreadyExists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }, { phone: req?.body?.phone }],
    });
    if (alreadyExists && alreadyExists._id !== id) {
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
export const deleteMe = async (req: any, res: any) => {
  if (!req?.user?.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  }
  const id = req.user.id;

  const user = await User.findByIdAndUpdate(id, { status: 'deleted' }, { new: true }).select('-password -__v');

  if (user?.email !== req.body.email) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User can not not  delete anyone else account' });
  }

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  return res.status(StatusCodes.OK).json({ message: 'User Deleted Successfully', user });
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

// update Password

export const updatePassword = async (req: any, res: any) => {
  try {
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

export const uploadProfilePic = async (req: any, res: any) => {
  // POST /users/profile-pic

  Upload(req, res, async () => {
    if (!req.file) {
      // No file was uploaded
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file selected!' });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      }
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
      }

      if (user.status === UserStatus.DELETED) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User is Delted' });
      }

      if (user.status === UserStatus.BLOCKED) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'User  is blocked' });
      }
      // Check if the user already has a profile picture
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, '../../public/profilePicture', user.profilePicture);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error(`Failed to delete old image: ${err}`);
        });
      }

      // Update user's profile picture
      user.profilePicture = path.join(__dirname, '../../../../public/profilePictures', req.file.filename);
      await user.save();

      res.json({ msg: 'Profile picture updated!', filePath: user.profilePicture });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
  });
};

export const generateUserOtp = async (req: any, res: any) => {
  const { id } = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User is Delted' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'User  is blocked' });
    }
    const otp = generateOTP();
    console.log(otp);
    const hashedOTP = await hashPassword(otp);
    user.emailVerificationOTP = hashedOTP;
    await user.save();
    return res.status(StatusCodes.OK).json({ message: 'OTP Generated Successfully' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};
