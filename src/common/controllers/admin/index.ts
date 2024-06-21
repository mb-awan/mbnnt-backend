import { StatusCodes } from 'http-status-codes';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';

// get users

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error fetching users', error });
  }
};

// block user

export const blockUser = async (req: any, res: any) => {
  try {
    const userEmail = req.query.email;
    console.log(userEmail);
    const user = await User.findOne({ email: userEmail });
    if (req.user.role === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot delete or block themselves.' });
    }
    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });
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
    console.log(userEmail);
    const user = await User.findOne({ email: userEmail });
    if (req.user.role === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot delete or block themselves.' });
    }
    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });
    user.status = UserStatus.DELETED;
    await user.save();
    res.status(StatusCodes.OK).send({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error blocking user', error });
  }
};

export const changeRole = async (req: any, res: any) => {
  try {
    const userEmail = req.query.email;
    console.log(userEmail);
    const user = await User.findOne({ email: userEmail });
    if (req.user.role === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot Change Role themselves.' });
    }
    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });
    user.role = UserRoles.ADMIN;
    await user.save();
    res.status(StatusCodes.OK).send({ message: ' make Admin successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error Admin Role', error });
  }
};
