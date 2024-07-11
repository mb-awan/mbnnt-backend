import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose, { isValidObjectId } from 'mongoose';

import { UserRoles } from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';
import { Role } from '@/common/models/roles';
import { User } from '@/common/models/user';

export const createRole = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty' });
    }

    const role = new Role(req.body);
    await role.save();
    res.status(StatusCodes.CREATED).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to create role' });
  }
};
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (page <= 0 || limit <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid page or limit value' });
    }

    const totalCount = await Role.countDocuments();
    const roles = await Role.find().populate('permissions').skip(skip).limit(limit);

    if (roles.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No roles found' });
    }

    //   const totalPages = Math.ceil(totalCount / limit);

    res.status(StatusCodes.OK).json({
      message: 'Successfully retrieved roles',

      pagination: {
        // totalPages,
        totalItems: totalCount,
        roles,
        // itemsPerPage: limit,
        // currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch roles' });
  }
};

export const getSingleRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Role ID is required' });
    }

    const role = await Role.findById(id).populate('permissions');
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully retrieved role', role });
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch role' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { name } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Role ID.' });
    }

    const role = await Role.findById(id);
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Role not found.' });
    }

    const protectedRoles = [
      UserRoles.ADMIN,
      UserRoles.SUB_ADMIN,
      UserRoles.TEACHER,
      UserRoles.STUDENT,
      UserRoles.VISITOR,
    ];
    if (protectedRoles.includes(role?.name as UserRoles)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: `The role '${role?.name}' cannot be edited.` });
    }

    if (!name || typeof name !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required and must be a string.' });
    }
    if (name !== role.name) {
      const existingPermission = await Role.findOne({ name });
      if (existingPermission) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Role name '${name}' already exists.` });
      }
    }
    role.name = name;
    await role.save();

    res.status(StatusCodes.OK).json({ message: `Role '${role.name}' updated successfully.` });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.query;
    if (!id && !name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Role ID or name is required' });
    }
    let role;
    if (id) {
      role = await Role.findById(id);
    } else if (name) {
      role = await Role.findOne({ name });
    }
    const protectedRoles = [
      UserRoles.ADMIN,
      UserRoles.SUB_ADMIN,
      UserRoles.TEACHER,
      UserRoles.STUDENT,
      UserRoles.VISITOR,
    ];
    if (protectedRoles.includes(role?.name as UserRoles)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: `The role '${role?.name}' cannot be deleted.` });
    }
    const userCount = await Role.countDocuments({ role: role?.name });

    if (userCount > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Cannot delete the role '${role?.name}' because it is assigned to one or more users.` });
    }
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully deleted role', role });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete role' });
  }
};

export const AssignPermissiontoRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { name, description } = req.body;

    const existingPermission = await Permission.findOne({ name });

    if (existingPermission) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: `Permission '${name}' already exists.` });
    }
    const permission = new Permission({ name, description });
    await permission.save();

    const role = await Role.findById(id);
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found' });
    }
    if (!role.permissions.includes(permission._id as mongoose.Types.ObjectId)) {
      role.permissions.push(permission._id as mongoose.Types.ObjectId);
      await role.save();
    }
    res.status(StatusCodes.OK).json({ message: 'Permission assigned to role successfully' });
  } catch (error) {
    console.error('Error assigning permission to role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to assign permission to role' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id, email, phone, username, roleId } = req.query;

    if (!email && !phone && !username) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'At least one identifier (email, phone, id, or username) must be provided.' });
    }

    const user = email
      ? await User.findOne({ email })
      : phone
        ? await User.findOne({ phone })
        : id
          ? await User.findById(id)
          : username
            ? await User.findOne({ username })
            : null;

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found.' });
    }

    if (!roleId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Role ID must be provided.' });
    }

    if (!isValidObjectId(roleId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Role ID format.' });
    }

    const existingRole = await Role.findById(roleId);
    if (!existingRole) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found.' });
    }
    user.role = existingRole._id as mongoose.Types.ObjectId;
    await user.save();
    return res.status(StatusCodes.OK).json({ message: 'User role updated successfully.' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error.' });
  }
};
