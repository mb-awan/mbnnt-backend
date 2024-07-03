import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { UserRoles, UserStatus } from '@/common/constants/enums';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRoles.ADMIN) {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).send({ message: 'Access denied. Admins only.' });
  }
};

const userStatuses: [string, ...string[]] = Object.values(UserStatus) as [string, ...string[]];
const userRoles: [string, ...string[]] = Object.values(UserRoles) as [string, ...string[]];
export const validateQueryParamSchema = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().min(2).optional(),
    status: z.enum(userStatuses).optional(),
    role: z.enum(userRoles).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .strict()
  .refine((data) => data.page && parseInt(data.page) > 0, { path: ['page'], message: 'Page must be greater than 0' })
  .refine((data) => data.limit && parseInt(data.limit) >= 10 && parseInt(data.limit) <= 100, {
    path: ['limit'],
    message: 'Limit must be between 10 and 100',
  });

// export const validateQueryParams = async (req: Request, res: Response, next: NextFunction) => {
//   const userStatuses: [string, ...string[]] = Object.values(UserStatus) as [string, ...string[]];
//   const userRoles: [string, ...string[]] = Object.values(UserRoles) as [string, ...string[]];

//   const validateQueryParamSchema = z
//     .object({
//       page: z.string().optional(),
//       limit: z.string().optional(),
//       email: z.string().email().optional(),
//       phone: z.string().min(2).optional(),
//       status: z.enum(userStatuses).optional(),
//       role: z.enum(userRoles).optional(),
//       createdAt: z.string().optional(),
//       updatedAt: z.string().optional(),
//     })
//     .strict()
//     .refine((data) => data.page && parseInt(data.page) > 0, { path: ['page'], message: 'Page must be greater than 0' })
//     .refine((data) => data.limit && parseInt(data.limit) >= 10 && parseInt(data.limit) <= 100, {
//       path: ['limit'],
//       message: 'Limit must be between 10 and 100',
//     });

//   try {
//     await validateQueryParamSchema.parseAsync(req.query);
//     next();
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
//     } else {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
//     }
//   }
// };

const addressSchema = z
  .object({
    street: z.string({ required_error: 'Street is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    zip: z.string({ required_error: 'ZIP code is required' }),
  })
  .strict();

export const updateUserSchema = z
  .object({
    firstName: z.string().optional(),

    lastName: z.string().optional(),

    email: z.string().email().optional(),

    phone: z.string().optional(),

    role: z.enum(userRoles).optional(),

    status: z.enum(userStatuses).optional(),

    emailVerified: z.boolean().optional(),

    phoneVerified: z.boolean().optional(),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
      .optional(),

    currentAddress: addressSchema.optional(),

    postalAddress: addressSchema.optional(),
  })
  .strict();

// export const valiadateUserUpdate = async (req: any, res: any, next: any) => {
//   const userStatuses: [string, ...string[]] = Object.values(UserStatus) as [string, ...string[]];
//   const userRoles: [string, ...string[]] = Object.values(UserRoles) as [string, ...string[]];

//   const addressSchema = z
//     .object({
//       street: z.string({ required_error: 'Street is required' }),
//       city: z.string({ required_error: 'City is required' }),
//       state: z.string({ required_error: 'State is required' }),
//       zip: z.string({ required_error: 'ZIP code is required' }),
//     })
//     .strict();

//   const updateUserSchema = z
//     .object({
//       firstName: z.string().optional(),

//       lastName: z.string().optional(),

//       email: z.string().email().optional(),

//       phone: z.string().optional(),

//       role: z.enum(userRoles).optional(),

//       status: z.enum(userStatuses).optional(),

//       emailVerified: z.boolean().optional(),

//       phoneVerified: z.boolean().optional(),

//       password: z
//         .string({ required_error: 'Password is required' })
//         .min(8, 'Password must be at least 8 characters long')
//         .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//         .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//         .regex(/[0-9]/, 'Password must contain at least one number')
//         .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
//         .optional(),

//       currentAddress: addressSchema.optional(),

//       postalAddress: addressSchema.optional(),
//     })
//     .strict();

//   try {
//     await updateUserSchema.parseAsync(req.body);
//     next();
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
//     } else {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
//     }
//   }
// };

// const addressSchema = z
//   .object({
//     street: z.string({ required_error: 'Street is required' }),
//     city: z.string({ required_error: 'City is required' }),
//     state: z.string({ required_error: 'State is required' }),
//     zip: z.string({ required_error: 'ZIP code is required' }),
//   })
//   .strict();

export const registerUserSchema = z
  .object({
    firstName: z.string().optional(),

    lastName: z.string().optional(),

    username: z.string({ required_error: 'Username is required' }).min(3).max(50),

    email: z.string().email('Invalid email address'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(8, 'Confirm password must be at least 8 characters long')
      .regex(/[a-z]/, 'Confirm password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Confirm password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Confirm password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Confirm password must contain at least one special character'),

    phone: z.string({ required_error: 'Phone number is required' }),
    currentAddress: addressSchema.optional(),
    postalAddress: addressSchema.optional(),
    role: z.enum(userRoles).optional(),
    emailVerified: z.boolean().optional(),
    phoneVerified: z.boolean().optional(),
    passwordUpdateRequested: z.boolean().optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // path of error
    message: 'Passwords must match',
  });

// export const createUserValidate = async (req: any, res: any, next: any) => {
//   const userRoles: [string, ...string[]] = Object.values(UserRoles) as [string, ...string[]];

//   const addressSchema = z
//     .object({
//       street: z.string({ required_error: 'Street is required' }),
//       city: z.string({ required_error: 'City is required' }),
//       state: z.string({ required_error: 'State is required' }),
//       zip: z.string({ required_error: 'ZIP code is required' }),
//     })
//     .strict();

//   const registerUserSchema = z
//     .object({
//       firstName: z.string().optional(),

//       lastName: z.string().optional(),

//       username: z.string({ required_error: 'Username is required' }).min(3).max(50),

//       email: z.string().email('Invalid email address'),

//       password: z
//         .string({ required_error: 'Password is required' })
//         .min(8, 'Password must be at least 8 characters long')
//         .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//         .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//         .regex(/[0-9]/, 'Password must contain at least one number')
//         .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

//       confirmPassword: z
//         .string({ required_error: 'Confirm password is required' })
//         .min(8, 'Confirm password must be at least 8 characters long')
//         .regex(/[a-z]/, 'Confirm password must contain at least one lowercase letter')
//         .regex(/[A-Z]/, 'Confirm password must contain at least one uppercase letter')
//         .regex(/[0-9]/, 'Confirm password must contain at least one number')
//         .regex(/[^a-zA-Z0-9]/, 'Confirm password must contain at least one special character'),

//       phone: z.string({ required_error: 'Phone number is required' }),
//       currentAddress: addressSchema.optional(),
//       postalAddress: addressSchema.optional(),
//       role: z.enum(userRoles).optional(),
//       emailVerified: z.boolean().optional(),
//       phoneVerified: z.boolean().optional(),
//       passwordUpdateRequested: z.boolean().optional(),
//     })
//     .strict()
//     .refine((data) => data.password === data.confirmPassword, {
//       path: ['confirmPassword'], // path of error
//       message: 'Passwords must match',
//     });

//   try {
//     await registerUserSchema.parseAsync(req.body);
//     next();
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
//     } else {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
//     }
//   }
// };
