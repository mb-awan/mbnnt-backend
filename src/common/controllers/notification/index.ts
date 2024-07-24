import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import Notification, { INotification } from '@/common/models/notification';
import { APIResponse } from '@/common/utils/response';

export const getAllNotificatons = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    const notifications = await Notification.find({ user: user.id });

    return APIResponse.success(res, 'Notifications fetched successfully', { notifications });
  } catch (e: any) {
    return APIResponse.error(res, e.message, e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getSingleNotification = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const { notificationId } = req.query;

    if (!notificationId) {
      return APIResponse.error(res, 'Notification id is required', null, StatusCodes.BAD_REQUEST);
    }

    const notification = await Notification.findOne({ _id: notificationId, user: user.id });

    if (!notification) {
      return APIResponse.error(res, 'Notification not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Notification fetched successfully', { notification });
  } catch (e: any) {
    return APIResponse.error(res, e.message, e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const { title, body, type, data } = req.body;

    const notification = new Notification({
      user: user.id,
      title,
      body,
      type,
      data,
    });

    await notification.save();

    return APIResponse.success(res, 'Notification created successfully', { notification });
  } catch (e: any) {
    return APIResponse.error(res, e.message, e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, type, data, read } = req.body;
    const { notificationId } = req.query;

    if (!notificationId) {
      return APIResponse.error(res, 'Notification id is required', null, StatusCodes.BAD_REQUEST);
    }

    const payload: Partial<INotification> = {};
    if (title) payload.title = title;
    if (body) payload.body = body;
    if (type) payload.type = type;
    if (data) payload.data = data;
    if (read) payload.read = read;

    const notification = await Notification.findOneAndUpdate({ _id: notificationId }, payload, { new: true });

    if (!notification) {
      return APIResponse.error(res, 'Notification not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Notification updated successfully', { notification });
  } catch (e: any) {
    return APIResponse.error(res, e.message, e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.query;

    if (!notificationId) {
      return APIResponse.error(res, 'Notification id is required', null, StatusCodes.BAD_REQUEST);
    }

    const notification = await Notification.findOneAndDelete({ _id: notificationId });

    if (!notification) {
      return APIResponse.error(res, 'Notification not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'Notification deleted successfully');
  } catch (e: any) {
    return APIResponse.error(res, e.message, e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
