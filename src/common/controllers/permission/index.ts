import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Permission } from '@/common/models/permissions';

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
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Permission ID is required' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Update data is required' });
    }

    const permission = await Permission.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!permission) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Permission not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully updated permission', permission });
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to update permission' });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Permission ID is required' });
    }

    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Permission not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully deleted permission', permission });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete permission' });
  }
};
