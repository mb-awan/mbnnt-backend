import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import Email from '@/common/models/email';
import { APIResponse } from '@/common/utils/response';

export const createEmail = async (req: Request, res: Response) => {
  try {
    const { to, from, subject, body, cc, bcc, attachments, sentAt, status, priority } = req.body;

    if (!to || !from || !subject || !body) {
      return APIResponse.error(res, 'All fields are required', null, StatusCodes.BAD_REQUEST);
    }

    const existingEmail = await Email.findOne({ to, from, subject, body });

    if (existingEmail) {
      return APIResponse.error(res, 'Email already exists', null, StatusCodes.CONFLICT);
    }

    const newEmail = new Email({
      to,
      from,
      subject,
      body,
      cc,
      bcc,
      attachments,
      sentAt,
      status,
      priority,
    });

    newEmail.save();
    return APIResponse.success(res, 'Email created successfully', { newEmail });
  } catch (error) {
    return APIResponse.error(res, 'Failed to create Email', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (page <= 0 || limit <= 0) {
      return APIResponse.error(res, 'Invalid page or limit value', null, StatusCodes.BAD_REQUEST);
    }

    const totalCount = await Email.countDocuments();
    const Emails = await Email.find().skip(skip).limit(limit);

    if (Emails.length === 0) {
      return APIResponse.error(res, 'No Emails found', null, StatusCodes.NOT_FOUND);
    }

    //   const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(
      res,
      'Successfully retrieved Emails',
      {
        totalItems: totalCount,
        Emails,
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error('Error fetching Emails:', error);
    return APIResponse.error(res, 'Failed to fetch Emails', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getSingleEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return APIResponse.error(res, 'Email ID is required', null, StatusCodes.BAD_REQUEST);
    }

    const Emails = await Email.findById(id);

    if (!Emails) {
      return APIResponse.error(res, 'Email not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'Email fetched successfully', { Emails });
  } catch (error) {
    console.error('Error fetching Email by ID:', error);
    return APIResponse.error(res, 'Failed to fetch Email', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { to, from, subject, body, cc, bcc, attachments, sentAt, status, priority } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return APIResponse.error(
        res,
        'Emails ID is required and must be a valid ObjectId',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const Emails = await Email.findById(id);
    if (!Emails) {
      return APIResponse.error(res, 'Email not found', null, StatusCodes.NOT_FOUND);
    }
    const existingEmails = await Email.findOne({
      to,
      from,
      subject,
      body,
      cc,
      bcc,
      attachments,
      sentAt,
      status,
      priority,
    });
    if (existingEmails) {
      return APIResponse.error(res, 'Email already exists', null, StatusCodes.BAD_REQUEST);
    }
    Emails.to = to;
    Emails.from = from;
    Emails.subject = subject;
    Emails.body = body;
    Emails.cc = cc;
    Emails.bcc = bcc;
    Emails.attachments = attachments;
    Emails.sentAt = sentAt;
    Emails.status = status;
    Emails.priority = priority;
    await Emails.save();

    return APIResponse.success(res, 'Email updated successfully', { Emails });
  } catch (error) {
    console.error('Error updating Email:', error);
    return APIResponse.error(res, 'Failed to update Email', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return APIResponse.error(res, 'Email ID is required', null, StatusCodes.BAD_REQUEST);
    }
    if (!mongoose.Types.ObjectId.isValid(id.toString())) {
      return APIResponse.error(res, 'Email ID is required and must be a valid ObjectId', null, StatusCodes.BAD_REQUEST);
    }

    let Emails;
    if (id) {
      Emails = await Email.findById(id);
    }
    if (!Emails) {
      return APIResponse.error(res, 'Email not found', null, StatusCodes.NOT_FOUND);
    }
    await Emails.deleteOne();

    return APIResponse.success(res, 'Email deleted successfully');
  } catch (error) {
    console.error('Error deleting Email:', error);
    return APIResponse.error(res, 'Failed to delete Email', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
