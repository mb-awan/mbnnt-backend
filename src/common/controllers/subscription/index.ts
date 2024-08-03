import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { Plan } from '@/common/models/plans';
import { Subscription } from '@/common/models/subscription';
import { User } from '@/common/models/user';
import { APIResponse } from '@/common/utils/response';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { user, plan, startDate, endDate, isActive } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'subscription detail are required', null, StatusCodes.BAD_REQUEST);
    }

    const username = await User.findOne({ username: user });
    if (!username) {
      return APIResponse.error(res, 'user not found', null, StatusCodes.NOT_FOUND);
    }

    const planName = await Plan.findOne({ name: plan });
    if (!planName) {
      return APIResponse.error(res, 'plan not found', null, StatusCodes.NOT_FOUND);
    }

    const existingsubscription = await Subscription.findOne({ user: req.body.user });

    if (existingsubscription) {
      return APIResponse.error(res, 'subscription already exists', null, StatusCodes.BAD_REQUEST);
    }
    const subscriptions = new Subscription({
      user: username._id,
      plan: planName._id,
      startDate,
      endDate,
      isActive,
    });
    await subscriptions.save();
    return APIResponse.success(res, 'subscription created successfully', { subscriptions }, StatusCodes.CREATED);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return APIResponse.error(res, 'Error creating subscription', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (page <= 0 || limit <= 0) {
      return APIResponse.error(res, 'Invalid page or limit value', null, StatusCodes.BAD_REQUEST);
    }

    const totalCount = await Subscription.countDocuments();
    const subscriptions = await Subscription.find().skip(skip).limit(limit).populate({
      path: 'plan',
      model: 'Plan',
      select: '-__v',
    });

    if (subscriptions.length === 0) {
      return APIResponse.error(res, 'No subscriptions found', null, StatusCodes.NOT_FOUND);
    }

    //   const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(
      res,
      'Successfully retrieved subscriptions',
      {
        totalItems: totalCount,
        subscriptions,
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return APIResponse.error(res, 'Failed to fetch subscriptions', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getSingleSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return APIResponse.error(res, 'subscription ID is required', null, StatusCodes.BAD_REQUEST);
    }

    const subscriptions = await Subscription.findById(id).populate({
      path: 'plan',
      model: 'Plan',
      select: '-__v',
    });
    if (!subscriptions) {
      return APIResponse.error(res, 'subscription not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'subscription fetched successfully', { subscriptions });
  } catch (error) {
    console.error('Error fetching subscription by ID:', error);
    return APIResponse.error(res, 'Failed to fetch subscription', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { user, plan, startDate, endDate, isActive } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return APIResponse.error(
        res,
        'subscriptions ID is required and must be a valid ObjectId',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const subscriptions = await Subscription.findById(id);
    if (!subscriptions) {
      return APIResponse.error(res, 'subscription not found', null, StatusCodes.NOT_FOUND);
    }

    if (!user || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return APIResponse.error(res, 'user ID is required and must be a valid ObjectId', null, StatusCodes.BAD_REQUEST);
    }

    if (!plan || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return APIResponse.error(res, 'plan ID is required and must be a valid ObjectId', null, StatusCodes.BAD_REQUEST);
    }

    if (!startDate || !endDate) {
      return APIResponse.error(res, 'Started Date && End Date', null, StatusCodes.BAD_REQUEST);
    }
    if (user !== subscriptions.user) {
      const existingsubscriptions = await Subscription.findOne({ user });
      if (existingsubscriptions) {
        return APIResponse.error(res, 'subscription already exists', null, StatusCodes.BAD_REQUEST);
      }
    }
    subscriptions.user = user;
    subscriptions.plan = plan;
    subscriptions.startDate = startDate;
    subscriptions.endDate = endDate;
    subscriptions.isActive = isActive;
    await subscriptions.save();

    return APIResponse.success(res, 'subscription updated successfully', { subscriptions });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return APIResponse.error(res, 'Failed to update subscription', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return APIResponse.error(res, 'subscription ID is required', null, StatusCodes.BAD_REQUEST);
    }
    let subscriptions;
    if (id) {
      subscriptions = await Subscription.findById(id);
    }
    if (!subscriptions) {
      return APIResponse.error(res, 'subscription not found', null, StatusCodes.NOT_FOUND);
    }
    await subscriptions.deleteOne();

    return APIResponse.success(res, 'subscription deleted successfully');
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return APIResponse.error(res, 'Failed to delete subscription', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
