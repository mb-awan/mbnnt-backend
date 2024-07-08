import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import { UserStatus } from '@/common/constants/enums';
import { Role } from '@/common/models/roles';
import { User } from '@/common/models/user';
import { IUser } from '@/common/types/users';
import { hashPassword } from '@/common/utils/auth';

// get users

export const getUsers = async (req: any, res: any) => {
  try {
    // Pagination parameters

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter parameters
    const { name, email, username, phone, status, role, createdAt, updatedAt, id } = req.query;
    const filters: Partial<IUser> & { $or?: any[] } = {};

    if (email) filters.email = email as string;
    if (id) filters.id = id as string;
    if (username) filters.username = username;
    if (name) filters.firstName = name;
    if (name) filters.lastName = name;
    if (phone) filters.phone = phone as string;
    if (status) filters.status = status as UserStatus;
    if (role) filters.role = role as Types.ObjectId;
    if (createdAt) filters.createdAt = { $gte: new Date(createdAt).toISOString() } as any;
    if (updatedAt) filters.updatedAt = { $gte: new Date(updatedAt).toISOString() } as any;

    if (name) {
      const nameRegex = new RegExp(name as string, 'i');
      filters.$or = [{ firstName: { $regex: nameRegex } }, { lastName: { $regex: nameRegex } }];
    }

    // Find users based on filters and pagination
    const usersQuery = User.find(filters)
      .select('-password -__v')
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'role',
        select: '-__v',
        populate: {
          path: 'permissions',
          model: 'Permission',
          select: '-__v',
        },
      });

    const [users, count] = await Promise.all([usersQuery, User.countDocuments(filters)]);

    return res.status(StatusCodes.OK).json({
      total: count,
      users,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users', error });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
    const { username, id, email } = req.query;
    if (!id && !email && !username) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'ID, Email, or Username is required' });
    }
    const query: any = {};
    if (id) query._id = id;
    if (email) query.email = email;
    if (username) query.username = username;
    const { ...updates } = req.body;
    const user = await User.findOne(query).select('-password -__v -username ');

    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });

    if (req.user.role.name === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot update their own details.' });
    }

    const userRole = await Role.findOne({ name: req.body.role }).populate({
      path: 'permissions',
      select: '-__v',
    });

    console.log(userRole);

    if (!userRole) {
      return res.status(StatusCodes.BAD_REQUEST).json({ messege: 'Invalid role' });
    }

    const restrictedFields = ['_id', 'email', 'passwordUpdateRequested'];

    for (const field of restrictedFields) {
      if (field in updates) {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: `Cannot update field: ${field}` });
      }
    }

    if (updates?.password) {
      if (!user.passwordUpdateRequested) {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Password update not requested' });
      }
      const hashedPassword = await hashPassword(updates.password);
      updates.password = hashedPassword;
      updates.passwordUpdateRequested = false;
    }

    if (updates.username && !updates.phone) {
      const alreadyExists = await User.findOne({ username: updates.username });
      if (alreadyExists && alreadyExists._id !== user._id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username already exists' });
      }
    } else if (updates.phone && !updates.username) {
      const alreadyExists = await User.findOne({ phone: updates.phone });
      if (alreadyExists && alreadyExists._id !== user._id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Phone number already exists' });
      }
    } else if (updates.phone && updates.username) {
      const alreadyExists = await User.findOne({
        $or: [{ email: updates.email }, { username: updates.username }, { phone: req?.body?.phone }],
      });
      if (alreadyExists && alreadyExists._id !== user._id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
      }
    }

    Object.assign(user, updates);
    user.role = userRole._id as Types.ObjectId;
    await user.save();

    if (updates?.password) {
      // TODO: Send email to user notifying them of password change
    }
    return res.status(StatusCodes.OK).send({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error updating user', error });
  }
};

// block user

export const blockUser = async (req: any, res: any) => {
  try {
    const { username, id, email } = req.query;

    if (!id && !email && !username) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'ID, Email, or Username is required' });
    }
    const query: any = {};
    if (id) query._id = id;
    if (email) query.email = email;
    if (username) query.username = username;

    const user = await User.findOne(query);

    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already blocked' });
    }

    if (req.user.role.name === user?.role) {
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
    const { username, id, email } = req.query;

    if (!id && !email && !username) {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'ID, Email, or Username is required' });
    }
    const query: any = {};
    if (id) query._id = id;
    if (email) query.email = email;
    if (username) query.username = username;

    const user = await User.findOne(query);

    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });

    if (user?.status === UserStatus.DELETED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User is already deleted' });
    }

    if (req.user.role.name === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot delete themselves.' });
    }

    user.status = UserStatus.DELETED;
    await user.save();
    res.status(StatusCodes.OK).send({ message: 'User delete successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error blocking user', error });
  }
};
