import { z } from 'zod';

const userRegisterValidate = (req: any, res: any, next: any) => {
  const schema = z.object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    email: z.string({ required_error: 'Email is Required' }).min(10).max(100),
    phone: z.string().min(3).max(20),
    password: z.string({ required_error: 'Password is Required' }).min(4),
  });

  const parseBody = schema.parseAsync(req.body);

  if (!parseBody) {
    return res.status(400).json({ messege: 'Bad Request' });
  }
  next();
};

const userLoginValidate = (req: any, res: any, next: any) => {
  const schema = z.object({
    email: z.string({ required_error: 'Email is Required' }).min(10).max(100),
    password: z.string({ required_error: 'Password is Required' }).min(4),
  });

  const parseBody = schema.parseAsync(req.body);

  if (!parseBody) {
    return res.status(400).json({ messege: 'Bad Request' });
  }
  next();
};

export { userLoginValidate, userRegisterValidate };
