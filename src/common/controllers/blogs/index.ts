import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BlogCategory } from '@/common/models/blogCategory';
import Blog from '@/common/models/blogs';
import { User } from '@/common/models/user';
import { APIResponse } from '@/common/utils/response';

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, author, images, category, status, tags, metaTitle, metaDescription, keywords } = req.body;

    if (!title || title.trim().length === 0) {
      return APIResponse.error(res, 'Title is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    if (title.length > 100) {
      return APIResponse.error(res, 'Title cannot be more than 100 characters', null, StatusCodes.BAD_REQUEST);
    }

    if (!content || content.trim().length === 0) {
      return APIResponse.error(res, 'Content is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    if (!author) {
      return APIResponse.error(res, 'Author is required', null, StatusCodes.BAD_REQUEST);
    }

    if (!category) {
      return APIResponse.error(res, 'Category is required', null, StatusCodes.BAD_REQUEST);
    }

    if (!status) {
      return APIResponse.error(res, 'Status is required', null, StatusCodes.BAD_REQUEST);
    }

    const existingBlog = await Blog.findOne({ title, content });
    if (existingBlog) {
      return APIResponse.error(res, 'Blog already exists', null, StatusCodes.CONFLICT);
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      images,
      category,
      status,
      tags,
      metaTitle,
      metaDescription,
      keywords,
    });
    await newBlog.save();
    return APIResponse.success(res, 'Blog created successfully', newBlog, StatusCodes.CREATED);
  } catch (error) {
    return APIResponse.error(res, 'Error creating Blog', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const blogsQuery = Blog.find(filters)
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'author',
        model: User,
        select: '-password -__v',
      })
      .populate({
        path: 'category',
        model: BlogCategory,
      });
    const totalCountQuery = Blog.countDocuments(filters);
    const [blogs, totalCount] = await Promise.all([blogsQuery, totalCountQuery]);
    const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(res, 'Blogs fetched successfully', {
      blogs,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getsingleBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const blog = await Blog.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '-password -__v',
      })
      .populate({
        path: 'category',
        model: BlogCategory,
      });
    if (!blog) {
      return APIResponse.error(res, 'Blog not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'Blog fetched successfully', blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return APIResponse.error(res, 'Error fetching Blog', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const editBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { title, content, images, tags, metaTitle, metaDescription, keywords } = req.body;
    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'Request body is required', null, StatusCodes.BAD_REQUEST);
    }

    if (req.body.author || req.body.category) {
      return APIResponse.error(res, 'Author and Category cannot be updated', null, StatusCodes.BAD_REQUEST);
    }

    const updatedBlog = await Blog.findById(id);

    if (!updatedBlog) {
      return APIResponse.error(res, 'Blog not found', null, StatusCodes.NOT_FOUND);
    }

    if (updatedBlog.title == title && updatedBlog.content == content) {
      return APIResponse.error(res, 'No changes made', null, StatusCodes.BAD_REQUEST);
    }
    updatedBlog.title = title;
    updatedBlog.content = content;
    updatedBlog.images = images;
    updatedBlog.tags = tags;
    updatedBlog.metaTitle = metaTitle;
    updatedBlog.metaDescription = metaDescription;
    updatedBlog.keywords = keywords;

    await updatedBlog.save();

    return APIResponse.success(res, 'Blog updated successfully', updatedBlog);
  } catch (error) {
    console.error('Error updating Blog:', error);
    return APIResponse.error(res, 'Error updating Blog', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    const deletedContactUs = await Blog.findByIdAndDelete(id);

    if (!deletedContactUs) {
      return APIResponse.error(res, 'Blog not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Blog deleted successfully', null);
  } catch (error) {
    console.error('Error deleting Blog:', error);
    if (error instanceof Error) {
      return APIResponse.error(
        res,
        `Error in deleting Blog: ${error.message}`,
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else {
      return APIResponse.error(res, 'Error deleting Blog', error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
