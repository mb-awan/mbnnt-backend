import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BlogCategory } from '@/common/models/blogCategory';
import { APIResponse } from '@/common/utils/response';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return APIResponse.error(res, 'Name is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }
    if (!description || description.trim().length === 0) {
      return APIResponse.error(res, 'Description is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }
    const existingCategory = await BlogCategory.findOne({ name });
    if (existingCategory) {
      return APIResponse.error(res, 'Category already exists', null, StatusCodes.CONFLICT);
    }
    const newCategory = new BlogCategory({ name, description });
    await newCategory.save();
    return APIResponse.success(res, 'Category created successfully', newCategory, StatusCodes.CREATED);
  } catch (error) {
    return APIResponse.error(res, 'Error creating Category', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }
    const categoryQuery = BlogCategory.find(filters).sort({ createdAt: 'desc' }).skip(skip).limit(limit);
    const totalCountQuery = BlogCategory.countDocuments(filters);
    const [categorys, totalCount] = await Promise.all([categoryQuery, totalCountQuery]);
    const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(res, 'Categorys fetched successfully', {
      categorys,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getsingleCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const category = await BlogCategory.findById(id);
    if (!category) {
      return APIResponse.error(res, 'Category not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'Category fetched successfully', category);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return APIResponse.error(res, 'Error fetching Category', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { name, description } = req.body;
    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'Request body is required', null, StatusCodes.BAD_REQUEST);
    }

    if (!name || name.trim().length === 0) {
      return APIResponse.error(res, 'Name is cannot be empty', null, StatusCodes.BAD_REQUEST);
    }
    if (!description || description.trim().length === 0) {
      return APIResponse.error(res, 'Description is cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    const updatedcategory = await BlogCategory.findById(id);

    if (!updatedcategory) {
      return APIResponse.error(res, 'Category not found', null, StatusCodes.NOT_FOUND);
    }
    if (updatedcategory.name == name) {
      return APIResponse.error(res, 'No changes made', null, StatusCodes.BAD_REQUEST);
    }
    if (updatedcategory.description == description) {
      return APIResponse.error(res, 'No changes made', null, StatusCodes.BAD_REQUEST);
    }
    updatedcategory.name = name;
    updatedcategory.description = description;

    await updatedcategory.save();

    return APIResponse.success(res, 'Category updated successfully', updatedcategory);
  } catch (error) {
    console.error('Error updating Category:', error);
    return APIResponse.error(res, 'Error updating Category', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    const deletedContactUs = await BlogCategory.findByIdAndDelete(id);

    if (!deletedContactUs) {
      return APIResponse.error(res, 'Category not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Category deleted successfully', deletedContactUs);
  } catch (error) {
    console.error('Error deleting Category:', error);
    if (error instanceof Error) {
      return APIResponse.error(
        res,
        `Error in deleting category: ${error.message}`,
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else {
      return APIResponse.error(res, `Serever Error`, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
