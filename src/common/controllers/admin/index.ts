import { StatusCodes } from 'http-status-codes';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';
import { IUser } from '@/common/types/users';
import { generateToken, hashPassword } from '@/common/utils/auth';
import { logger } from '@/server';

// get users

export const getUsers = async (req: any, res: any) => {
  try {
    // Pagination parameters

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter parameters
    const { email, phone, status, role, createdAt, updatedAt } = req.query;
    const filters: Partial<IUser> = {};

    if (email) filters.email = email as string;
    if (phone) filters.phone = phone as string;
    if (status) filters.status = status as UserStatus;
    if (role) filters.role = role as UserRoles;
    if (createdAt) filters.createdAt = { $gte: new Date(createdAt).toISOString() } as any;
    if (updatedAt) filters.updatedAt = { $gte: new Date(updatedAt).toISOString() } as any;

    // Find users based on filters and pagination
    const usersQuery = User.find({ _id: { $ne: req.user.id }, role: { $ne: UserRoles.ADMIN }, ...filters })
      .select('-password -__v')
      .skip(skip)
      .limit(limit);
    const [users, count] = await Promise.all([
      usersQuery,
      User.countDocuments({ ...filters, role: { $ne: UserRoles.ADMIN } }),
    ]);

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
    const email = req.query.email;
    const { ...updates } = req.body;
    const user = await User.findOne({ email }).select('-password -__v');

    if (!user) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User not found' });

    if (req.user.role === user?.role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin cannot update their own details.' });
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

    Object.assign(user, updates);
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

// register new user as admin

export const registerNewUser = async (req: any, res: any) => {
  try {
    if (req.body.passwordUpdateRequested) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Admin can"t have permission to change passwordUpdateRequested is not allowed.' });
    }
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser && existingUser.status !== UserStatus.DELETED) {
      return res.status(StatusCodes.CONFLICT).json({ messege: 'Account already exists' });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ messege: 'Passwords must match' });
    }

    const hashedPassword = await hashPassword(req.body.password);

    let user = null;
    if (!existingUser) {
      const newUser = new User(req.body);
      newUser.password = hashedPassword;
      user = await newUser.save();
    } else {
      Object.keys(req.body).forEach((key) => {
        (existingUser as any)[key] = req.body[key];
      });
      existingUser.password = hashedPassword;
      existingUser.status = UserStatus.ACTIVE;

      user = await existingUser.save();
    }

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering' });
    }

    const token = await generateToken(user);

    if (!token) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        messege:
          'You have registered successfully, but unfortunately something went wrong while generating token, so please login with your credentials to get the token',
      });
    }

    return res.status(StatusCodes.OK).json({ messege: 'Registered successfully', token });
  } catch (error) {
    logger.error('Error while registering', JSON.stringify(error) || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering', data: error });
  }
};
