import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BlogCategory } from '@/common/models/blogCategory';
import Blog from '@/common/models/blogs';
import { User } from '@/common/models/user';

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, author, images, category, status, tags, metaTitle, metaDescription, keywords } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Title is required and cannot be empty' });
    }

    if (title.length > 100) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Title cannot exceed 100 characters' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Content is required and cannot be empty' });
    }

    if (!author) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Author is required' });
    }

    if (!category) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Category is required' });
    }

    if (!status) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Status is required' });
    }

    const existingBlog = await Blog.findOne({ title, content });
    if (existingBlog) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'A blog with this title already exists' });
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
    res.status(StatusCodes.CREATED).json(newBlog);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
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

    res.status(StatusCodes.OK).json({
      blogs,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
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
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
    }
    res.status(StatusCodes.OK).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching the blog' });
  }
};

export const editBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { title, content, images, tags, metaTitle, metaDescription, keywords } = req.body;
    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty or invalid' });
    }

    if (req.body.author || req.body.category) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You cannot edit your author or category' });
    }

    const updatedBlog = await Blog.findById(id);

    if (!updatedBlog) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: ' Blog  not found' });
    }

    if (updatedBlog.title == title && updatedBlog.content == content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No changes made' });
    }
    updatedBlog.title = title;
    updatedBlog.content = content;
    updatedBlog.images = images;
    updatedBlog.tags = tags;
    updatedBlog.metaTitle = metaTitle;
    updatedBlog.metaDescription = metaDescription;
    updatedBlog.keywords = keywords;

    await updatedBlog.save();

    res.status(StatusCodes.OK).json({ message: 'Successfully updated', updatedBlog });
  } catch (error) {
    console.error('Error updating Blog:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update Blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    const deletedContactUs = await Blog.findByIdAndDelete(id);

    if (!deletedContactUs) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Blog not found' });
    }

    res.status(StatusCodes.OK).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting Blog:', error);
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to delete Blog: ${error.message}` });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete Blog' });
    }
  }
};
