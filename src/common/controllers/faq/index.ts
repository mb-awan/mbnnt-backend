import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FAQ } from '@/common/models/faq';

export const createFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer, category, isActive } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Question is required and cannot be empty' });
    }

    if (!answer || answer.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Answer is required and cannot be empty' });
    }

    if (!isActive) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'isActive is required' });
    }

    if (!category) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Category is required' });
    }

    const existingFaq = await FAQ.findOne({ question, answer });
    if (existingFaq) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'FAQ already exists' });
    }

    const newFaq = new FAQ({
      question,
      answer,
      category,
      isActive,
    });

    await newFaq.save();
    res.status(StatusCodes.CREATED).json(newFaq);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};
export const getAllFaq = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.question) filters.question = req.query.question;

    const faqQuery = FAQ.find(filters).sort({ createdAt: 'desc' }).skip(skip).limit(limit);
    const totalCountQuery = FAQ.countDocuments(filters);
    const [faq, totalCount] = await Promise.all([faqQuery, totalCountQuery]);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(StatusCodes.OK).json({
      faq,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};

export const getsingleFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Faq not found' });
    }
    res.status(StatusCodes.OK).json(faq);
  } catch (error) {
    console.error('Error fetching faq:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching the faq' });
  }
};

export const editFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { question, answer, category, isActive } = req.body;
    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty or invalid' });
    }

    const updatedFaq = await FAQ.findById(id);

    if (!updatedFaq) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Faq not found' });
    }

    if (updatedFaq.answer == answer && updatedFaq.question == question) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No changes made' });
    }
    updatedFaq.answer = answer;
    updatedFaq.question = question;
    updatedFaq.category = category;
    updatedFaq.isActive = isActive;

    await updatedFaq.save();

    res.status(StatusCodes.OK).json({ message: 'Successfully updated', updatedFaq });
  } catch (error) {
    console.error('Error updating Faq:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update Faq' });
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    const deletedFaq = await FAQ.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Faq not found' });
    }

    res.status(StatusCodes.OK).json({ message: 'Faq deleted successfully' });
  } catch (error) {
    console.error('Error deleting Faq:', error);
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to delete Faq: ${error.message}` });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete Faq' });
    }
  }
};
