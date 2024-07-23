import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import Notification, { INotification } from '@/common/models/notification';

export const getAllNotificatons = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    const notifications = await Notification.find({ user: user.id });

    res.status(StatusCodes.OK).json({ success: true, notifications });
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
};

export const getSingleNotification = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const { notificationId } = req.query;

    if (!notificationId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Notification id is required',
      });
    }

    const notification = await Notification.findOne({ _id: notificationId, user: user.id });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(StatusCodes.OK).json({ success: true, notification });
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
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

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Notification created successfully',
      notification,
    });
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, type, data, read } = req.body;
    const { notificationId } = req.query;

    if (!notificationId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Notification id is required',
      });
    }

    const payload: Partial<INotification> = {};
    if (title) payload.title = title;
    if (body) payload.body = body;
    if (type) payload.type = type;
    if (data) payload.data = data;
    if (read) payload.read = read;

    const notification = await Notification.findOneAndUpdate({ _id: notificationId }, payload, { new: true });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(StatusCodes.OK).json({ success: true, notification });
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.query;

    if (!notificationId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Notification id is required',
      });
    }

    const notification = await Notification.findOneAndDelete({ _id: notificationId });

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(StatusCodes.OK).json({ success: true, message: 'Notification deleted successfully' });
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
};
