import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { Role } from '@/common/models/roles';
import { User } from '@/common/models/user';
import { IRoles } from '@/common/types/users';
import { generateToken, hashOTP, hashPassword, isValidOTP, isValidPassword } from '@/common/utils/auth';
import { generateOTP } from '@/common/utils/generateOTP';
import { APIResponse } from '@/common/utils/response';
import { logger } from '@/server';

// Register user controller
export const registerUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }, { phone: req?.body?.phone }],
    });

    if (existingUser && existingUser.status !== UserStatus.DELETED) {
      return APIResponse.error(res, 'User already exists', null, StatusCodes.CONFLICT);
    }

    if (req.body.password !== req.body.confirmPassword) {
      return APIResponse.error(res, 'Password and Confirm Password do not match', null, StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(req.body.password);

    const userRole = await Role.findOne({ name: req.body.role });

    if (!userRole) {
      return APIResponse.error(res, 'Role not found', null, StatusCodes.NOT_FOUND);
    }

    let user = null;

    delete req.body.confirmPassword;
    delete req.body.role;

    const otp = generateOTP(); // generate OTP
    console.log(otp);
    const hashedOTP = await hashOTP(otp);

    // Send email to user with OTP if user is not created by the admin (Hint: there will be no user in the req.user object if the user is not created by the admin)

    if (!existingUser) {
      const newUser = new User(req.body);
      newUser.password = hashedPassword;

      newUser.role = userRole._id as Types.ObjectId;

      newUser.emailVerificationOTP = hashedOTP;

      user = await newUser.save();
    }

    // TODO: Send confirmation email to the user that admin has creaed an account on there email and send the credentials to login to the user
    else {
      Object.keys(req.body).forEach((key) => {
        (existingUser as any)[key] = req.body[key];
      });
      existingUser.password = hashedPassword;
      existingUser.status = UserStatus.ACTIVE;

      existingUser.role = userRole._id as Types.ObjectId;

      existingUser.emailVerificationOTP = hashedOTP;

      user = await existingUser.save();
    }

    if (!user) {
      return APIResponse.error(res, 'Error while registering', null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const token = await generateToken({ ...user.toObject(), role: userRole });

    if (!token) {
      return APIResponse.error(
        res,
        'You have registered successfully, but unfortunately something went wrong while generating token, so please login with your credentials to get the token',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return APIResponse.success(res, 'User registered successfully', { token });
  } catch (error) {
    logger.error('Error while registering 456', JSON.stringify(error) || error);
    return APIResponse.error(res, 'Error while registering', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// Login user controller
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, username, phone, fromAdminPanel } = req.body;
    if (!email && !username && !phone) {
      return APIResponse.error(res, 'Email, username, or phone is required', null, StatusCodes.BAD_REQUEST);
    }

    const user = await User.findOne({
      ...(email && { email }),
      ...(username && { username }),
      ...(phone && { phone }),
    }).populate({
      path: 'role',
      select: '-__v',
    });

    if (!user) {
      return APIResponse.error(res, 'Invalid Credentials', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'Invalid Credentials', null, StatusCodes.NOT_FOUND);
    }

    const userRole = (user.role as IRoles).name;

    // only allow admin and subadmin to login from admin panel
    if (fromAdminPanel && userRole !== UserRoles.ADMIN && userRole !== UserRoles.SUB_ADMIN) {
      return APIResponse.error(res, 'Invalid Credentials', null, StatusCodes.NOT_FOUND);
    }

    const validPassword = await isValidPassword(req.body.password, user.password);

    if (!validPassword) {
      return APIResponse.error(res, 'Invalid Credentials', null, StatusCodes.BAD_REQUEST);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    const token = await generateToken(user);
    user.accessToken = token;

    if (user.TFAEnabled) {
      const otp = generateOTP();
      user.TFAOTP = await hashOTP(otp);

      console.log({ TFAOTP: otp });
      //TODO: send the OTP to the user's email
      await user.save();

      return APIResponse.success(res, 'Credentials verified successfully', {
        token: null,
        TFAEnabled: true,
        role: userRole,
      });
    }

    await user.save();

    return APIResponse.success(res, 'Logged in successfully', { token, TFAEnabled: false, role: userRole });
  } catch (error) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// verify email by OTP Controller
export const verifyEmailByOTP = async (req: Request, res: Response) => {
  const { otp } = req.query;
  const { id } = req.user;

  if (!otp) {
    return APIResponse.error(res, 'OTP is required', null, StatusCodes.BAD_REQUEST);
  }

  if (!id) {
    return APIResponse.error(res, 'Not Authorized', null, StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    const validOTP = await isValidOTP(otp as string, user.emailVerificationOTP as string);

    if (validOTP) {
      user.emailVerified = true;
      user.emailVerificationOTP = '';
      await user.save();

      return APIResponse.success(res, 'Email verified successfully');
    } else {
      return APIResponse.error(res, 'Invalid OTP', null, StatusCodes.BAD_REQUEST);
    }
  } catch (error: any) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// verify phone by OTP Controller
export const verifyPhoneByOTP = async (req: Request, res: Response) => {
  const { otp } = req.query;
  const { id } = req.user;

  if (!otp) {
    return APIResponse.error(res, 'OTP is required', null, StatusCodes.BAD_REQUEST);
  }

  if (!id) {
    return APIResponse.error(res, 'Not Authorized', null, StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    const validOTP = await isValidOTP(otp as string, user.phoneVerificationOTP as string);
    if (validOTP) {
      user.phoneVerified = true;
      user.phoneVerificationOTP = '';
      await user.save();

      return APIResponse.success(res, 'Phone verified successfully');
    } else {
      return APIResponse.error(res, 'Invalid OTP', null, StatusCodes.BAD_REQUEST);
    }
  } catch (error: any) {
    console.error(error.message);
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// verify username controller
export const validateUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });

    if (!user) {
      return APIResponse.error(res, 'Username not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user) {
      return APIResponse.success(res, 'Username found', { exists: true });
    }
  } catch (error) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// request forgot password OTP controller
export const requestForgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { email, username, phone } = req.query;
    if (!email && !username && !phone) {
      return APIResponse.error(res, 'Email, username, or phone is required', null, StatusCodes.BAD_REQUEST);
    }
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    } else if (phone) {
      user = await User.findOne({ phone });
    }
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    const otp = generateOTP();
    console.log({ forgotPasswordOTP: otp });
    const hashedOTP = await hashOTP(otp);

    user.forgotPasswordOTP = hashedOTP;

    await user.save();

    return APIResponse.success(res, 'OTP sent successfully');
  } catch (error: any) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// verify forgot password OTP controller
export const verifyforgotPasswordOTP = async (req: Request, res: Response) => {
  const { otp, username, email, phone } = req.query;

  try {
    // Find user by username, email, or phone
    const user = await User.findOne({
      ...(email && { email }),
      ...(username && { username }),
      ...(phone && { phone }),
    }).populate({
      path: 'role',
      select: '-__v',
      populate: {
        path: 'permissions',
        model: 'Permission',
        select: '-__v',
      },
    });

    if (!user) {
      return APIResponse.error(res, 'Invalid Username or email or password', null, StatusCodes.NOT_FOUND);
    }
    const validOTP = await isValidOTP(otp as string, user.forgotPasswordOTP as string);
    // Check if the OTP matches the forgotPasswordOTP stored in the user document
    if (!validOTP) {
      return APIResponse.error(res, 'OTP does not match', null, StatusCodes.BAD_REQUEST);
    }

    if (validOTP) {
      const token = generateToken(user);
      user.forgotPasswordOTP = '';
      await user.save();
      return APIResponse.success(res, 'OTP verified successfully', { token });
    }
  } catch (error: any) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// generate phone verification OTP controller
export const generatePhoneVerificationOTP = async (req: Request, res: Response) => {
  const { id } = req.user;

  if (!id) {
    return APIResponse.error(res, 'Not Authorized', null, StatusCodes.UNAUTHORIZED);
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (!user.phone) {
      return APIResponse.error(res, 'Phone number not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.phoneVerified) {
      return APIResponse.error(res, 'Phone number already verified', null, StatusCodes.BAD_REQUEST);
    }

    // Generate a 5 digit OTP
    const otp = generateOTP();
    console.log({ phoneOTP: otp });

    //TODO: Send the OTP to the user's phone number

    const hashedOTP = await hashPassword(otp);
    user.phoneVerificationOTP = hashedOTP;

    await user.save();
    return APIResponse.success(res, 'OTP sent successfully');
  } catch (error: any) {
    console.error(error.message);
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// generate email verification OTP controller
export const generateEmailVerificationOtp = async (req: Request, res: Response) => {
  const { id } = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }
    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }
    const otp = generateOTP();
    console.log({ EmailOTP: otp });

    // TODO: Send the OTP to the user's email

    const hashedOTP = await hashPassword(otp);
    user.emailVerificationOTP = hashedOTP;

    await user.save();
    return APIResponse.success(res, 'OTP sent successfully');
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const verifyTwoFactorAuthentication = async (req: Request, res: Response) => {
  const { username, email, phone, otp } = req.query;
  try {
    // Find user by username, email, or phone
    const user = await User.findOne({
      ...(email && { email }),
      ...(username && { username }),
      ...(phone && { phone }),
    }).populate({
      path: 'role',
      select: '-__v -permissions',
    });

    if (!user) {
      return APIResponse.error(res, 'Invalid username, email or phone', null, StatusCodes.NOT_FOUND);
    }

    if (!user.TFAOTP) {
      return APIResponse.error(res, 'Two Factor Authentication not enabled', null, StatusCodes.BAD_REQUEST);
    }

    const validOTP = await isValidOTP(otp as string, user.TFAOTP);

    if (!validOTP) {
      return APIResponse.error(res, 'OTP does not match', null, StatusCodes.BAD_REQUEST);
    }

    if (validOTP) {
      user.TFAOTP = '';
      const token = user.accessToken;
      await user.save();

      return APIResponse.success(res, 'Two Factor Authentication verified successfully', {
        token,
        role: (user.role as IRoles).name,
        TFAEnabled: user.TFAEnabled,
      });
    }
  } catch (error: any) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const resendTFAOTP = async (req: Request, res: Response) => {
  const { username, email, phone } = req.query;
  try {
    const user = await User.findOne({
      ...(email && { email }),
      ...(username && { username }),
      ...(phone && { phone }),
    });

    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.DELETED) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'User is blocked', null, StatusCodes.FORBIDDEN);
    }

    if (!user.TFAEnabled) {
      return APIResponse.error(res, 'Two Factor Authentication not enabled', null, StatusCodes.BAD_REQUEST);
    }

    if (!user.TFAOTP) {
      return APIResponse.error(res, 'First verify your credentials', null, StatusCodes.UNAUTHORIZED);
    }

    if (!user.accessToken) {
      return APIResponse.error(res, 'First login to get the token', null, StatusCodes.UNAUTHORIZED);
    }

    const otp = generateOTP();

    console.log({ TFAOTP: otp });

    // TODO: send the OTP to the user's email

    user.TFAOTP = await hashOTP(otp);

    await user.save();

    return APIResponse.success(res, 'OTP sent successfully');
  } catch (error: any) {
    return APIResponse.error(res, 'Internal server error', error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
