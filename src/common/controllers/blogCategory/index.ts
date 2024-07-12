import { StatusCodes } from 'http-status-codes';

import { BlogCategory } from '@/common/models/blogCategory';

export const createCategory = async (req: any, res: any) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name is required and cannot be empty' });
    }
    if (!description || description.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Description is cannot be empty' });
    }
    const existingCategory = await BlogCategory.findOne({ name });
    if (existingCategory) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'A Category with this title already exists' });
    }
    const newCategory = new BlogCategory({ name, description });
    await newCategory.save();
    res.status(StatusCodes.CREATED).json(newCategory);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};
export const getAllCategory = async (req: any, res: any) => {
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

    res.status(StatusCodes.OK).json({
      categorys,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};

export const getsingleCategory = async (req: any, res: any) => {
  try {
    const { id } = req.query;
    const category = await BlogCategory.findById(id);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Category not found' });
    }
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching the Category' });
  }
};

export const editCategory = async (req: any, res: any) => {
  try {
    const { id } = req.query;
    const { name, description } = req.body;
    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty or invalid' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Name is required and cannot be empty' });
    }
    if (!description || description.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Description is cannot be empty' });
    }

    const updatedcategory = await BlogCategory.findById(id);

    if (!updatedcategory) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: ' Category not found' });
    }
    if (updatedcategory.name == name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No changes made' });
    }
    if (updatedcategory.description == description) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No changes made' });
    }
    updatedcategory.name = name;
    updatedcategory.description = description;

    await updatedcategory.save();

    res.status(StatusCodes.OK).json({ message: 'Successfully updated Category', updatedcategory });
  } catch (error) {
    console.error('Error updating Category:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update Category' });
  }
};

export const deleteCategory = async (req: any, res: any) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    const deletedContactUs = await BlogCategory.findByIdAndDelete(id);

    if (!deletedContactUs) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Category not found' });
    }

    res.status(StatusCodes.OK).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting Category:', error);
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to delete category: ${error.message}` });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete Category' });
    }
  }
};
