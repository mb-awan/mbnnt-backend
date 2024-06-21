import { StatusCodes } from 'http-status-codes';

import { UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';

// get users

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password -__v');
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error fetching users', error });
  }
};

// block user

export const blockUser = async (req: any, res: any) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Email is required' });

    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already blocked' });
    }

    if (req.user.role === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot delete or block themselves.' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User is already deleted' });
    }

    user.status = UserStatus.BLOCKED;
    await user.save();
    res.status(StatusCodes.OK).send({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error blocking user', error });
  }
};

// delete user

export const deleteUser = async (req: any, res: any) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Email is required' });

    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });

    if (user?.status === UserStatus.DELETED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User is already deleted' });
    }

    if (req.user.role === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot delete themselves.' });
    }

    user.status = UserStatus.DELETED;
    await user.save();
    res.status(StatusCodes.OK).send({ message: 'User delete successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error blocking user', error });
  }
};
