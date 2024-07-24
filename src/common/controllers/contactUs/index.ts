import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ContactUs from '@/common/models/contactUs';
import { APIResponse } from '@/common/utils/response';

export const createContactUs = async (req: Request, res: Response) => {
  try {
    const { name, email, message, image, category } = req.body;

    if (!name || !email || !message || !category) {
      return APIResponse.error(res, 'Missing required fields', null, StatusCodes.BAD_REQUEST);
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      typeof category !== 'string'
    ) {
      return APIResponse.error(res, 'Invalid data type', null, StatusCodes.BAD_REQUEST);
    }

    if (image && typeof image !== 'string') {
      return APIResponse.error(res, 'Invalid data type', null, StatusCodes.BAD_REQUEST);
    }

    const existingEntry = await ContactUs.findOne({ email });
    if (existingEntry) {
      return APIResponse.error(res, 'Contact us entry already exists', null, StatusCodes.CONFLICT);
    }

    const newcontactUs = new ContactUs({ name, email, message, image, category });

    const result = await newcontactUs.save();

    return APIResponse.success(res, 'Contact us entry created successfully', { result }, StatusCodes.CREATED);
  } catch (error) {
    console.error('Error creating contact us entry:', error);
    return APIResponse.error(res, 'Error creating contact us entry', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getAllContactUs = async (req: Request, res: Response) => {
  try {
    const contactUsEntries = await ContactUs.find();
    if (!contactUsEntries) {
      return APIResponse.error(res, 'No contact us entries found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'Contact us entries fetched successfully', { contactUsEntries });
  } catch (error) {
    console.error('Error fetching contact us entries:', error);
    return APIResponse.error(res, 'Error fetching contact us entries', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getContactUsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }
    const contactUsEntry = await ContactUs.findById(id);

    if (!contactUsEntry) {
      return APIResponse.error(res, 'Contact us entry not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Contact us entry fetched successfully', { contactUsEntry });
  } catch (error) {
    console.error('Error fetching contact us entry:', error);
    if (error instanceof Error) {
      return APIResponse.error(
        res,
        `Error fetching contact us entry: ${error.message}`,
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else {
      return APIResponse.error(res, 'Error fetching contact us entry', error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};

export const updateContactUsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { message, image, category } = req.body;
    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'Request body is required', null, StatusCodes.BAD_REQUEST);
    }

    if (req.body.name || req.body.email) {
      return APIResponse.error(res, 'Name and Email cannot be updated', null, StatusCodes.BAD_REQUEST);
    }

    const updatedContactUs = await ContactUs.findById(id);

    if (!updatedContactUs) {
      return APIResponse.error(res, 'Contact us entry not found', null, StatusCodes.NOT_FOUND);
    }

    if (
      updatedContactUs.message == message &&
      updatedContactUs.image == image &&
      updatedContactUs.category == category
    ) {
      return APIResponse.error(res, 'No changes made', null, StatusCodes.BAD_REQUEST);
    }
    updatedContactUs.message = message;
    updatedContactUs.image = image;
    updatedContactUs.category = category;

    await updatedContactUs.save();

    return APIResponse.success(res, 'Contact us entry updated successfully', { contactUs: updatedContactUs });
  } catch (error) {
    console.error('Error updating contact us entry:', error);
    return APIResponse.error(res, 'Error updating contact us entry', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteContactUsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return APIResponse.error(res, 'Invalid or missing id parameter', null, StatusCodes.BAD_REQUEST);
    }

    const deletedContactUs = await ContactUs.findByIdAndDelete(id);

    if (!deletedContactUs) {
      return APIResponse.error(res, 'Contact us entry not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Contact us entry deleted successfully');
  } catch (error) {
    console.error('Error deleting contact us entry:', error);
    if (error instanceof Error) {
      return APIResponse.error(
        res,
        `Error in deleting contact us entry: ${error.message}`,
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else {
      return APIResponse.error(res, 'Error deleting contact us entry', error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
