import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { AdminPermissions, StudentPermissions, TeacherPermissions, VisitorPermissions } from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';
import { Role } from '@/common/models/roles';

export const createPermission = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty' });
    }

    const permission = new Permission(req.body);
    await permission.save();
    res.status(StatusCodes.CREATED).json({ message: 'Permission created successfully', permission });
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to create permission' });
  }
};

export const getAllPermission = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (page <= 0 || limit <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid page or limit value' });
    }

    const totalCount = await Permission.countDocuments();
    const permissions = await Permission.find().skip(skip).limit(limit);

    if (permissions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No permissions found' });
    }

    //   const totalPages = Math.ceil(totalCount / limit);

    res.status(StatusCodes.OK).json({
      message: 'Successfully retrieved permissions',
      pagination: {
        totalItems: totalCount,
        permissions,
      },
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch permissions' });
  }
};

export const getSinglePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Permission ID is required' });
    }

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Permission not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully retrieved permission', permission });
  } catch (error) {
    console.error('Error fetching permission by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch permission' });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { name, description } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid permission ID.' });
    }

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Permission not found.' });
    }

    const seedPermissions = [
      ...Object.values(VisitorPermissions),
      ...Object.values(StudentPermissions),
      ...Object.values(TeacherPermissions),
      ...Object.values(AdminPermissions),
    ];

    if (
      seedPermissions.includes(
        permission.name as VisitorPermissions | StudentPermissions | TeacherPermissions | AdminPermissions
      )
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `The permission '${permission.name}' cannot be modified because it is seeded.` });
    }

    if (!name || typeof name !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required and must be a string.' });
    }
    if (name !== permission.name) {
      const existingPermission = await Permission.findOne({ name });
      if (existingPermission) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Permission name '${name}' already exists.` });
      }
    }
    permission.name = name;
    permission.description = description;
    await permission.save();

    res.status(StatusCodes.OK).json({ message: `Permission '${permission.name}' updated successfully.` });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.query;
    if (!id && !name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Permission ID or name is required' });
    }
    let permission;
    if (id) {
      permission = await Permission.findById(id);
    } else if (name) {
      permission = await Permission.findOne({ name });
    }
    if (!permission) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `Permission not found.` });
    }
    const seedPermissions = [
      ...Object.values(VisitorPermissions),
      ...Object.values(StudentPermissions),
      ...Object.values(TeacherPermissions),
      ...Object.values(AdminPermissions),
    ];

    if (
      seedPermissions.includes(
        permission.name as VisitorPermissions | StudentPermissions | TeacherPermissions | AdminPermissions
      )
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `The permission '${permission.name}' cannot be modified because it is seeded.` });
    }
    const roleCount = await Role.countDocuments({ permissions: permission._id });

    if (roleCount > 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Cannot delete the permission '${permission.name}' because it is assigned to more than one roles.`,
      });
    }
    await permission.deleteOne();

    res.status(StatusCodes.OK).json({ message: `Permission '${permission.name}' deleted successfully.` });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error });
  }
};
