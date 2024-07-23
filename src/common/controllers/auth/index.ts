import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import { UserRoles, UserStatus } from '@/common/constants/enums';
import { Role } from '@/common/models/roles';
import { User } from '@/common/models/user';
import { IRoles } from '@/common/types/users';
import { generateToken, hashOTP, hashPassword, isValidOTP, isValidPassword } from '@/common/utils/auth';
import { generateOTP } from '@/common/utils/generateOTP';
import { logger } from '@/server';

// Register user controller
export const registerUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }, { phone: req?.body?.phone }],
    });

    if (existingUser && existingUser.status !== UserStatus.DELETED) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ messege: 'This Email is already associated with an account, please try to login' });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ messege: 'Passwords must match' });
    }

    const hashedPassword = await hashPassword(req.body.password);

    const userRole = await Role.findOne({ name: req.body.role });

    if (!userRole) {
      return res.status(StatusCodes.BAD_REQUEST).json({ messege: 'Invalid role' });
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering 123' });
    }

    const token = await generateToken({ ...user.toObject(), role: userRole });

    if (!token) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        messege:
          'You have registered successfully, but unfortunately something went wrong while generating token, so please login with your credentials to get the token',
      });
    }

    return res.status(StatusCodes.OK).json({ messege: 'Registered successfully', token });
  } catch (error) {
    logger.error('Error while registering 456', JSON.stringify(error) || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering' });
  }
};

// Login user controller
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, username, phone, fromAdminPanel } = req.body;
    if (!email && !username && !phone) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'At least one of email, username, or phone must be provided.' });
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
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid Credentials' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid Credentials' });
    }

    const userRole = (user.role as IRoles).name;

    // only allow admin and subadmin to login from admin panel
    if (fromAdminPanel && userRole !== UserRoles.ADMIN && userRole !== UserRoles.SUB_ADMIN) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid Credentials' });
    }

    const validPassword = await isValidPassword(req.body.password, user.password);

    if (!validPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Credentials' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account is blocked' });
    }

    const token = await generateToken(user);
    user.accessToken = token;

    if (user.TFAEnabled) {
      const otp = generateOTP();
      user.TFAOTP = await hashOTP(otp);

      console.log({ TFAOTP: otp });
      //TODO: send the OTP to the user's email
      await user.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Credentials verified successfully',
        token: null,
        TFAEnabled: true,
        role: userRole,
      });
    }

    await user.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged in successfully',
      token,
      TFAEnabled: false,
      role: userRole,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// verify email by OTP Controller
export const verifyEmailByOTP = async (req: Request, res: Response) => {
  const { otp } = req.query;
  const { id } = req.user;

  if (!otp) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'OTP is required' });
  }

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unauthorized' });
    }

    const validOTP = await isValidOTP(otp as string, user.emailVerificationOTP as string);

    if (validOTP) {
      user.emailVerified = true;
      user.emailVerificationOTP = '';
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid OTP' });
    }
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// verify phone by OTP Controller
export const verifyPhoneByOTP = async (req: Request, res: Response) => {
  const { otp } = req.query;
  const { id } = req.user;

  if (!otp) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'OTP is required' });
  }

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    const validOTP = await isValidOTP(otp as string, user.phoneVerificationOTP as string);
    if (validOTP) {
      user.phoneVerified = true;
      user.phoneVerificationOTP = '';
      await user.save();

      res.json({ msg: 'Phone verified successfully' });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid OTP' });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// verify username controller
export const validateUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ exists: false });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.OK).json({ exists: false });
    }

    if (user) {
      return res.status(StatusCodes.OK).json({ exists: true });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// request forgot password OTP controller
export const requestForgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { email, username, phone } = req.query;
    if (!email && !username && !phone) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'At least one of email, username, or phone must be provided.' });
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
      return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    }

    const otp = generateOTP();
    console.log({ forgotPasswordOTP: otp });
    const hashedOTP = await hashOTP(otp);

    user.forgotPasswordOTP = hashedOTP;

    await user.save();

    return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
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
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Username or email or password' });
    }
    const validOTP = await isValidOTP(otp as string, user.forgotPasswordOTP as string);
    // Check if the OTP matches the forgotPasswordOTP stored in the user document
    if (!validOTP) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'OTP does not match' });
    }

    if (validOTP) {
      const token = generateToken(user);
      user.forgotPasswordOTP = '';
      await user.save();
      return res.status(StatusCodes.OK).json({ message: 'User Validated', token });
    }
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// generate phone verification OTP controller
export const generatePhoneVerificationOTP = async (req: Request, res: Response) => {
  const { id } = req.user;

  if (!id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorized' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    if (!user.phone) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Phone number not found' });
    }

    if (user.phoneVerified) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Phone already verified' });
    }

    // Generate a 5 digit OTP
    const otp = generateOTP();
    console.log({ phoneOTP: otp });

    //TODO: Send the OTP to the user's phone number

    const hashedOTP = await hashPassword(otp);
    user.phoneVerificationOTP = hashedOTP;

    await user.save();
    return res.status(StatusCodes.OK).json({ message: 'Phone verification OTP has been sent' });
  } catch (error: any) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// generate email verification OTP controller
export const generateEmailVerificationOtp = async (req: Request, res: Response) => {
  const { id } = req.user;
  const user = await User.findById(id);

  try {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Account is Deleted' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is blocked' });
    }
    const otp = generateOTP();
    console.log({ EmailOTP: otp });

    // TODO: Send the OTP to the user's email

    const hashedOTP = await hashPassword(otp);
    user.emailVerificationOTP = hashedOTP;

    await user.save();
    return res.status(StatusCodes.OK).json({ message: 'OTP sent Successfully' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
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
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Username or email or password' });
    }

    if (!user.TFAOTP) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid OTP' });
    }

    const validOTP = await isValidOTP(otp as string, user.TFAOTP);

    if (!validOTP) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'OTP does not match' });
    }

    if (validOTP) {
      user.TFAOTP = '';
      const token = user.accessToken;
      await user.save();
      return res.status(StatusCodes.OK).json({
        message: 'User Validated',
        token,
        success: true,
        TFAEnabled: user.TFAEnabled,
        role: (user.role as IRoles).name,
      });
    }
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Error disabling TFA', error: 'Internal server error' });
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
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not found' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not found' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not Found' });
    }

    if (!user.TFAEnabled) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'TFA is not enabled' });
    }

    if (!user.TFAOTP) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'First verify your credentials' });
    }

    if (!user.accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'First verify your credentials' });
    }

    const otp = generateOTP();

    console.log({ TFAOTP: otp });

    // TODO: send the OTP to the user's email

    user.TFAOTP = await hashOTP(otp);

    await user.save();

    return res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
