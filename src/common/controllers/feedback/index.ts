import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import Feedback from '@/common/models/feedback';
import { User } from '@/common/models/user';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { userId, email, feedbackType, message, rating, images } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    if (!userId || userId.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'id is required and cannot be empty' });
    }

    if (!email || email.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email is required and cannot be empty' });
    }

    if (!feedbackType) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'feedbacktype is required' });
    }

    if (!message) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'message is required' });
    }

    if (!rating) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'rating is required' });
    }
    const existingFeedback = await Feedback.findOne({ message, userId });
    if (existingFeedback) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'feedback already exists' });
    }

    const newFeedback = new Feedback({
      userId,
      email,
      feedbackType,
      message,
      rating,
      images,
    });

    await newFeedback.save();
    res.status(StatusCodes.CREATED).json(newFeedback);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.feedbacktype) {
      filters.feedbackType = req.query.feedbackType;
    }

    const feedbackQuery = Feedback.find(filters).sort({ createdAt: 'desc' }).skip(skip).limit(limit).populate({
      path: 'userId',
      model: User,
      select: '-password -__v',
    });
    const totalCountQuery = Feedback.countDocuments(filters);
    const [feedback, totalCount] = await Promise.all([feedbackQuery, totalCountQuery]);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(StatusCodes.OK).json({
      feedback,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};

export const getsingleFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const feedback = await Feedback.findById(id).populate({
      path: 'userId',
      model: User,
      select: '-password -__v',
    });
    if (!feedback) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Feedback not found' });
    }
    res.status(StatusCodes.OK).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching the feedback' });
  }
};

export const editFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { userId, email, feedbackType, message, rating, images } = req.body;
    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty or invalid' });
    }

    const updatedFeedback = await Feedback.findById(id);

    if (!updatedFeedback) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Feedback not found' });
    }

    if (userId && email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'userId and email cannot be updated' });
    }

    if (updatedFeedback.message == message) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No changes made' });
    }

    updatedFeedback.feedbackType = feedbackType;
    updatedFeedback.message = message;
    updatedFeedback.rating = rating;
    updatedFeedback.images = images;

    await updatedFeedback.save();

    res.status(StatusCodes.OK).json({ message: 'Successfully updated', updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update feedback' });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'feedback not found' });
    }

    res.status(StatusCodes.OK).json({ message: 'feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to delete feedback: ${error.message}` });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete feedback' });
    }
  }
};
