import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FAQ } from '@/common/models/faq';
import { APIResponse } from '@/common/utils/response';

export const createFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer, category, isActive } = req.body;

    if (!question || question.trim().length === 0) {
      return APIResponse.error(res, 'Question is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    if (!answer || answer.trim().length === 0) {
      return APIResponse.error(res, 'Answer is required and cannot be empty', null, StatusCodes.BAD_REQUEST);
    }

    if (!isActive) {
      return APIResponse.error(res, 'isActive is required', null, StatusCodes.BAD_REQUEST);
    }

    if (!category) {
      return APIResponse.error(res, 'Category is required', null, StatusCodes.BAD_REQUEST);
    }

    const existingFaq = await FAQ.findOne({ question, answer });
    if (existingFaq) {
      return APIResponse.error(res, 'Faq already exists', null, StatusCodes.CONFLICT);
    }

    const newFaq = new FAQ({
      question,
      answer,
      category,
      isActive,
    });

    await newFaq.save();
    return APIResponse.success(res, 'Faq created successfully', newFaq, StatusCodes.CREATED);
  } catch (error) {
    return APIResponse.error(res, 'Error creating Faq', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const getAllFaq = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }

    const faqQuery = FAQ.find(filters).sort({ createdAt: 'desc' }).skip(skip).limit(limit);
    const totalCountQuery = FAQ.countDocuments(filters);
    const [faq, totalCount] = await Promise.all([faqQuery, totalCountQuery]);
    const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(res, 'Faqs fetched successfully', {
      faq,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getsingleFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const faq = await FAQ.findById(id);
    if (!faq) {
      return APIResponse.error(res, 'Faq not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'Faq fetched successfully', faq);
  } catch (error) {
    console.error('Error fetching faq:', error);
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const editFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { question, answer, category, isActive } = req.body;
    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'Request body is required', null, StatusCodes.BAD_REQUEST);
    }

    const updatedFaq = await FAQ.findById(id);

    if (!updatedFaq) {
      return APIResponse.error(res, 'Faq not found', null, StatusCodes.NOT_FOUND);
    }

    if (updatedFaq.answer == answer && updatedFaq.question == question) {
      return APIResponse.error(res, 'No changes detected', null, StatusCodes.BAD_REQUEST);
    }
    updatedFaq.answer = answer;
    updatedFaq.question = question;
    updatedFaq.category = category;
    updatedFaq.isActive = isActive;

    await updatedFaq.save();

    return APIResponse.success(res, 'Faq updated successfully', updatedFaq);
  } catch (error) {
    console.error('Error updating Faq:', error);
    return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    const deletedFaq = await FAQ.findByIdAndDelete(id);

    if (!deletedFaq) {
      return APIResponse.error(res, 'Faq not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Faq deleted successfully', deletedFaq);
  } catch (error) {
    console.error('Error deleting Faq:', error);
    if (error instanceof Error) {
      return APIResponse.error(res, `Error in deleting: ${error.message}`, error, StatusCodes.INTERNAL_SERVER_ERROR);
    } else {
      return APIResponse.error(res, 'Server Error', error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
