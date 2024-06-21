import { StatusCodes } from 'http-status-codes';

import { UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';

// get users

export const getUsers = async (req: any, res: any) => {
  try {
    // default page 1
    const page = parseInt(req.query.page as string) || 1;
    // default limit of users are 10 users per page
    const limit = parseInt(req.query.limit as string) || 10;
    // skip is used to skip the first page user and show next page
    const skip = (page - 1) * limit;
    // showing users
    const users = await User.find({ _id: { $ne: req.user.id }, role: { $ne: 'admin' } })
      .select('-password -__v')
      .skip(skip)
      .limit(limit);
    // count total users in the database
    const count = await User.countDocuments();
    res.status(StatusCodes.OK).json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users,
    });

    // res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error fetching users', error });
  }
};

// get user by filter

export const searchUsersByFilter = async (req: any, res: any) => {
  interface IUser {
    email: string;
    phone: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }
  try {
    const { email, phone, createdAt, updatedAt } = req.query;
    const filters: Partial<IUser> = {};

    if (email) filters.email = email as string;
    if (phone) filters.phone = phone as string;
    if (createdAt) filters.createdAt = { $gte: new Date(createdAt) } as any;
    if (updatedAt) filters.updatedAt = { $gte: new Date(updatedAt) } as any;

    if (!Object.keys(filters).length) {
      return res.status(400).json({ error: 'At least one search parameter is required.' });
    }
    const users = await User.find(filters);
    // if filters array is empty return not found
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error, messege: ' Internal Server Error' });
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
