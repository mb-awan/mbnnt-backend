import { StatusCodes } from 'http-status-codes';

import ContactUs from '@/common/models/contactUs';

export const createContactUs = async (req: any, res: any) => {
  try {
    const { name, email, message, image, category } = req.body;

    if (!name || !email || !message || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      typeof category !== 'string'
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data types' });
    }

    if (image && typeof image !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid image data' });
    }

    const existingEntry = await ContactUs.findOne({ email });
    if (existingEntry) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'Duplicate entry found' });
    }

    const newcontactUs = new ContactUs({ name, email, message, image, category });

    const result = await newcontactUs.save();

    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    console.error('Error creating contact us entry:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

export const getAllContactUs = async (req: any, res: any) => {
  try {
    const contactUsEntries = await ContactUs.find();
    if (!contactUsEntries) {
      return res.status(StatusCodes.NO_CONTENT).json({ error: 'No contact us entries found' });
    }
    res.status(StatusCodes.OK).json(contactUsEntries);
  } catch (error) {
    console.error('Error fetching contact us entries:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch contact us entries' });
  }
};

export const getContactUsById = async (req: any, res: any) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
      return;
    }
    const contactUsEntry = await ContactUs.findById(id);

    if (!contactUsEntry) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Contact us entry not found' });
      return;
    }
    res.status(StatusCodes.OK).json(contactUsEntry);
  } catch (error) {
    console.error('Error fetching contact us entry:', error);
    if (error instanceof Error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `Failed to fetch contact us entry: ${error.message}` });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch contact us entry' });
    }
  }
};

export const updateContactUsById = async (req: any, res: any) => {
  try {
    const { id } = req.query;
    const { message, image, category } = req.body;
    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Request body is empty or invalid' });
    }

    if (req.body.name || req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'You cannot edit your name or email' });
    }

    const updatedContactUs = await ContactUs.findById(id);

    if (!updatedContactUs) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Contact us entry not found' });
    }

    if (
      updatedContactUs.message == message &&
      updatedContactUs.image == image &&
      updatedContactUs.category == category
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No changes made' });
    }
    updatedContactUs.message = message;
    updatedContactUs.image = image;
    updatedContactUs.category = category;

    await updatedContactUs.save();

    res.status(StatusCodes.OK).json(updatedContactUs);
  } catch (error) {
    console.error('Error updating contact us entry:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update contact us entry' });
  }
};

export const deleteContactUsById = async (req: any, res: any) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or missing id parameter' });
    }

    const deletedContactUs = await ContactUs.findByIdAndDelete(id);

    if (!deletedContactUs) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Contact us entry not found' });
    }

    res.status(StatusCodes.OK).json({ message: 'Contact us entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact us entry:', error);
    if (error instanceof Error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `Failed to delete contact us entry: ${error.message}` });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete contact us entry' });
    }
  }
};
