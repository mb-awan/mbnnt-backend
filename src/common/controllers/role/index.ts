import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Role } from '@/common/models/roles';

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
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Role ID is required' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Update data is required' });
    }

    const role = await Role.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('permissions');
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully updated role', role });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to update role' });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Role ID is required' });
    }

    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Role not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Successfully deleted role', role });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete role' });
  }
};
