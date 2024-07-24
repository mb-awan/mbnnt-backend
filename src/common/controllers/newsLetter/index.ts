import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import Newsletter from '@/common/models/newsLetter';
import { User } from '@/common/models/user';
import { APIResponse } from '@/common/utils/response';

export const createNewsLetter = async (req: Request, res: Response) => {
  const { title, content, author, subscribers, tags, isPublished } = req.body;

  if (subscribers?.length > 0) {
    for (const subscriber of subscribers) {
      const userExists = await User.findById(subscriber);
      if (!userExists) return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
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

    return APIResponse.success(res, 'NewsLetter created successfully', newsletter, StatusCodes.CREATED);
  } catch (error) {
    return APIResponse.error(res, 'Error creating NewsLetter', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { title, content, author, subscribers, tags, isPublished } = req.body;

  if (subscribers?.length > 0) {
    for (const subscriber of subscribers) {
      const userExists = await User.findById(subscriber);
      if (!userExists) return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }
  }

  try {
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return APIResponse.error(res, 'NewsLetter not found', null, StatusCodes.NOT_FOUND);

    await newsLetter.updateOne({
      title,
      content,
      author,
      subscribers,
      tags,
      isPublished,
    });

    return APIResponse.success(res, 'NewsLetter updated successfully', null, StatusCodes.OK);
  } catch (error) {
    return APIResponse.error(res, 'Error updating NewsLetter', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getNewsLetterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return APIResponse.error(res, 'NewsLetter not found', null, StatusCodes.NOT_FOUND);

    return APIResponse.success(res, 'NewsLetter fetched successfully', newsLetter, StatusCodes.OK);
  } catch (error) {
    return APIResponse.error(res, 'Error fetching NewsLetter', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getNewsLetters = async (req: Request, res: Response) => {
  try {
    const newsLetters = await Newsletter.find();
    return APIResponse.success(res, 'NewsLetters fetched successfully', newsLetters, StatusCodes.OK);
  } catch (error) {
    return APIResponse.error(res, 'Error fetching NewsLetters', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteNewsLetter = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return APIResponse.error(res, 'NewsLetter not found', null, StatusCodes.NOT_FOUND);

    await newsLetter.deleteOne();
    return APIResponse.success(res, 'NewsLetter deleted successfully', null, StatusCodes.OK);
  } catch (error) {
    return APIResponse.error(res, 'Error deleting NewsLetter', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const subscribeToNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.query;
  const userId = req?.user?.id;
  try {
    const newsLetter = await Newsletter.findById(id);

    if (!newsLetter) return APIResponse.error(res, 'NewsLetter not found', null, StatusCodes.NOT_FOUND);

    const { subscribers } = newsLetter;
    const subscriberExists = subscribers.find((subscriber) => subscriber.toString() === userId);

    if (subscriberExists) {
      return APIResponse.success(res, 'already subscribed', null, StatusCodes.OK);
    }

    newsLetter.subscribers.push(new mongoose.Types.ObjectId(userId));
    await newsLetter.save();

    return APIResponse.success(res, 'Subscribed successfully', null, StatusCodes.OK);
  } catch (e) {
    return APIResponse.error(res, 'Internal server error', e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const unSubscribeToNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.query;
  const userId = req?.user?.id;
  try {
    const newsLetter = await Newsletter.findById(id);

    if (!newsLetter) return APIResponse.error(res, 'NewsLetter not found', null, StatusCodes.NOT_FOUND);

    const { subscribers } = newsLetter;

    const subscriberExists = subscribers.find((subscriber) => subscriber.toString() === userId);

    if (!subscriberExists) {
      return APIResponse.error(res, 'Not subscribed', null, StatusCodes.OK);
    }

    newsLetter.subscribers = subscribers.filter((subscriber) => subscriber.toString() !== userId);
    await newsLetter.save();

    return APIResponse.success(res, 'Unsubscribed successfully', null, StatusCodes.OK);
  } catch (e) {
    return APIResponse.error(res, 'Internal server error', e, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
