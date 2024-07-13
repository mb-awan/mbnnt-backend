import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import Newsletter from '@/common/models/newsLetter';
import { User } from '@/common/models/user';

export const createNewsLetter = async (req: Request, res: Response) => {
  const { title, content, author, subscribers, tags, isPublished } = req.body;

  if (subscribers?.length > 0) {
    for (const subscriber of subscribers) {
      const userExists = await User.findById(subscriber);
      if (!userExists) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
    }
  }

  try {
    const newsletter = await Newsletter.create({
      title,
      content,
      author,
      subscribers,
      tags,
      isPublished,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'NewsLetter created successfully',
      newsletter,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};

export const updateNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { title, content, author, subscribers, tags, isPublished } = req.body;

  if (subscribers?.length > 0) {
    for (const subscriber of subscribers) {
      const userExists = await User.findById(subscriber);
      if (!userExists) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
    }
  }

  try {
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'NewsLetter not found' });

    await newsLetter.updateOne({
      title,
      content,
      author,
      subscribers,
      tags,
      isPublished,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'NewsLetter updated successfully',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};

export const getNewsLetterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'NewsLetter not found' });

    return res.status(StatusCodes.OK).json(newsLetter);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};

export const getNewsLetters = async (req: Request, res: Response) => {
  try {
    const newsLetters = await Newsletter.find();
    return res.status(StatusCodes.OK).json(newsLetters);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteNewsLetter = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'NewsLetter not found' });

    await newsLetter.deleteOne();
    return res.status(StatusCodes.OK).json({ success: true, message: 'NewsLetter deleted successfully' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};

export const subscribeToNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.query;
  const userId = req?.user?.id;
  try {
    const newsLetter = await Newsletter.findById(id);

    if (!newsLetter) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'NewsLetter not found' });

    const { subscribers } = newsLetter;
    const subscriberExists = subscribers.find((subscriber) => subscriber.toString() === userId);

    if (subscriberExists) {
      return res.status(StatusCodes.OK).json({ success: true, message: 'already subscribed' });
    }

    newsLetter.subscribers.push(new mongoose.Types.ObjectId(userId));
    await newsLetter.save();

    return res.status(StatusCodes.OK).json({ success: true, message: 'Subscribed successfully' });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};

export const unSubscribeToNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.query;
  const userId = req?.user?.id;
  try {
    const newsLetter = await Newsletter.findById(id);

    if (!newsLetter) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'NewsLetter not found' });

    const { subscribers } = newsLetter;

    const subscriberExists = subscribers.find((subscriber) => subscriber.toString() === userId);

    if (!subscriberExists) {
      return res.status(StatusCodes.OK).json({ success: true, message: 'already unsubscribed' });
    }

    newsLetter.subscribers = subscribers.filter((subscriber) => subscriber.toString() !== userId);
    await newsLetter.save();

    return res.status(StatusCodes.OK).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
  }
};
