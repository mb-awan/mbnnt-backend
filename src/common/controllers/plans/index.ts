import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { Plan } from '@/common/models/plans';
import { APIResponse } from '@/common/utils/response';

export const createPlan = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return APIResponse.error(res, 'plan detail are required', null, StatusCodes.BAD_REQUEST);
    }

    const existingPlan = await Plan.findOne({ name: req.body.name });

    if (existingPlan) {
      return APIResponse.error(res, 'plan name already exists', null, StatusCodes.BAD_REQUEST);
    }
    const plans = new Plan(req.body);
    await plans.save();
    return APIResponse.success(res, 'plan created successfully', { plans }, StatusCodes.CREATED);
  } catch (error) {
    console.error('Error creating plan:', error);
    return APIResponse.error(res, 'Error creating plan', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (page <= 0 || limit <= 0) {
      return APIResponse.error(res, 'Invalid page or limit value', null, StatusCodes.BAD_REQUEST);
    }

    const totalCount = await Plan.countDocuments();
    const plans = await Plan.find().skip(skip).limit(limit);

    if (plans.length === 0) {
      return APIResponse.error(res, 'No plans found', null, StatusCodes.NOT_FOUND);
    }

    //   const totalPages = Math.ceil(totalCount / limit);

    return APIResponse.success(
      res,
      'Successfully retrieved plans',
      {
        totalItems: totalCount,
        plans,
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error('Error fetching plans:', error);
    return APIResponse.error(res, 'Failed to fetch plans', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getSinglePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return APIResponse.error(res, 'plan ID is required', null, StatusCodes.BAD_REQUEST);
    }

    const plans = await Plan.findById(id);
    if (!plans) {
      return APIResponse.error(res, 'plan not found', null, StatusCodes.NOT_FOUND);
    }
    return APIResponse.success(res, 'plan fetched successfully', { plans });
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    return APIResponse.error(res, 'Failed to fetch plan', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { name, description, price } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id.toString())) {
      return APIResponse.error(res, 'plans ID is required and must be a valid ObjectId', null, StatusCodes.BAD_REQUEST);
    }

    const plans = await Plan.findById(id);
    if (!plans) {
      return APIResponse.error(res, 'plan not found', null, StatusCodes.NOT_FOUND);
    }
    if (!name || typeof name !== 'string') {
      return APIResponse.error(res, 'plan name is required', null, StatusCodes.BAD_REQUEST);
    }
    if (name !== plans.name) {
      const existingplans = await Plan.findOne({ name });
      if (existingplans) {
        return APIResponse.error(res, 'plan name already exists', null, StatusCodes.BAD_REQUEST);
      }
    }
    plans.name = name;
    plans.description = description;
    plans.price = price;
    await plans.save();

    return APIResponse.success(res, 'plan updated successfully', { plans });
  } catch (error) {
    console.error('Error updating plan:', error);
    return APIResponse.error(res, 'Failed to update plan', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.query;
    if (!id && !name) {
      return APIResponse.error(res, 'plan ID or name is required', null, StatusCodes.BAD_REQUEST);
    }
    let plans;
    if (id) {
      plans = await Plan.findById(id);
    } else if (name) {
      plans = await Plan.findOne({ name });
    }
    if (!plans) {
      return APIResponse.error(res, 'plan not found', null, StatusCodes.NOT_FOUND);
    }
    await plans.deleteOne();

    return APIResponse.success(res, 'plan deleted successfully');
  } catch (error) {
    console.error('Error deleting plan:', error);
    return APIResponse.error(res, 'Failed to delete plan', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
