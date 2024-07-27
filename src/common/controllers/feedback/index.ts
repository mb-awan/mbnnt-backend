import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import Feedback from '@/common/models/feedback';
import { User } from '@/common/models/user';
import { APIResponse } from '@/common/utils/response';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { userId, email, feedbackType, message, rating, images } = req.body;

    if (!userId || typeof userId !== 'string') {
      return APIResponse.error(res, 'Invalid or missing userId parameter', null, StatusCodes.BAD_REQUEST);
    }

    if (!userId || userId.trim().length === 0) {
      return APIResponse.error(res, 'userId is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    if (!email || email.trim().length === 0) {
      return APIResponse.error(res, 'email is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    if (!feedbackType) {
      return APIResponse.error(res, 'feedbackType is required', null, StatusCodes.BAD_REQUEST);
    }

    if (!message) {
      return APIResponse.error(res, 'message is required', null, StatusCodes.BAD_REQUEST);
    }

    if (!rating) {
      return APIResponse.error(res, 'rating is required', null, StatusCodes.BAD_REQUEST);
    }
    const existingFeedback = await Feedback.findOne({ message, userId });
    if (existingFeedback) {
      return APIResponse.error(res, 'Feedback already exists', null, StatusCodes.CONFLICT);
    }
    userId as unknown as Types.ObjectId;
    const newFeedback = new Feedback({
      userId,
      email,
      feedbackType,
      message,
      rating,
      images,
    });

    await newFeedback.save();
    return APIResponse.success(res, 'Feedback created successfully', { feedback: newFeedback }, StatusCodes.CREATED);
  } catch (error) {
    return APIResponse.error(res, 'Error creating Feedback', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.feedbacktype) filters.feedbackType = req.query.feedbackType;
    if (req.query.email) filters.email = req.query.email;
    if (req.query.id) filters.id = req.query.id;

    const feedbackQuery = Feedback.find(filters).sort({ createdAt: 'desc' }).skip(skip).limit(limit).populate({
      path: 'userId',
      model: User,
      select: '-password -__v',
    });
    const totalCountQuery = Feedback.countDocuments(filters);
    const [feedback, totalCount] = await Promise.all([feedbackQuery, totalCountQuery]);
    const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(res, 'Feedbacks fetched successfully', {
      feedback,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
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
      return APIResponse.error(res, 'Feedback not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'Feedback fetched successfully', { feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const editFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { userId, email, feedbackType, message, rating, images } = req.body;
    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'Request body is required', null, StatusCodes.BAD_REQUEST);
    }

    const updatedFeedback = await Feedback.findById(id);

    if (!updatedFeedback) {
      return APIResponse.error(res, 'Feedback not found', null, StatusCodes.NOT_FOUND);
    }

    if (userId && email) {
      return APIResponse.error(res, 'userId and email cannot be updated', null, StatusCodes.BAD_REQUEST);
    }

    if (updatedFeedback.message == message) {
      return APIResponse.error(res, 'No changes detected', null, StatusCodes.BAD_REQUEST);
    }

    updatedFeedback.feedbackType = feedbackType;
    updatedFeedback.message = message;
    updatedFeedback.rating = rating;
    updatedFeedback.images = images;

    await updatedFeedback.save();

    return APIResponse.success(res, 'Feedback updated successfully', { feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return APIResponse.error(res, 'Feedback not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    if (error instanceof Error) {
      return APIResponse.error(res, `Error in deleting: ${error.message}`, error, StatusCodes.INTERNAL_SERVER_ERROR);
    } else {
      return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
