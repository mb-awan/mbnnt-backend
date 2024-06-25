import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const userUpdateValidate = async (req: any, res: any, next: any) => {
  const addressSchema = z
    .object({
      street: z.string({ required_error: 'Street is required' }),
      city: z.string({ required_error: 'City is required' }),
      state: z.string({ required_error: 'State is required' }),
      zip: z.string({ required_error: 'ZIP code is required' }),
    })
    .strict();

  const updateUserSchema = z
    .object({
      firstName: z.string().optional(),

      lastName: z.string().optional(),
      currentAddress: addressSchema.optional(),

      postalAddress: addressSchema.optional(),
    })
    .strict();

  try {
    await updateUserSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: error.errors });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
};
