import { StatusCodes } from 'http-status-codes';

import { UserStatus } from '@/common/constants/enums';
import { User } from '@/common/models/user';
import { generateToken, hashPassword, isValidPassword } from '@/common/utils/auth';
import { generateOTP } from '@/common/utils/generateOTP';
import { logger } from '@/server';

const registerUser = async (req: any, res: any) => {
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

    let user = null;
    const otp = generateOTP(); // generate OTP

    // TODO: Send email to user with OTP if user is not created by the admin (Hint: there will be no user in the req.user object if the user is not created by the admin)

    // TODO: Send confirmation email to the user that admin has creaed an account on there email and send the credentials to login to the user

    if (!existingUser) {
      const newUser = new User(req.body);
      newUser.password = hashedPassword;
      newUser.emailVerificationOTP = otp;
      user = await newUser.save();
    } else {
      Object.keys(req.body).forEach((key) => {
        (existingUser as any)[key] = req.body[key];
      });
      existingUser.password = hashedPassword;
      existingUser.status = UserStatus.ACTIVE;
      existingUser.emailVerificationOTP = otp;

      user = await existingUser.save();
    }

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering' });
    }

    const token = await generateToken(user);

    if (!token) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        messege:
          'You have registered successfully, but unfortunately something went wrong while generating token, so please login with your credentials to get the token',
      });
    }

    return res.status(StatusCodes.OK).json({ messege: 'Registered successfully', token });
  } catch (error) {
    logger.error('Error while registering', JSON.stringify(error) || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering', data: error });
  }
};

const loginUser = async (req: any, res: any) => {
  try {
    const { email, username, phone } = req.body;
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
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Credentials' });
    }

    if (user.status === UserStatus.DELETED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'This account is deleted' });
    }

    const validPassword = await isValidPassword(req.body.password, user.password);

    if (!validPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Credentials' });
    }

    if (user.status === UserStatus.BLOCKED) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'This account is blocked' });
    }

    // TODO: Add more checks here if user email is not verified

    const token = await generateToken(user);

    return res.status(StatusCodes.OK).json({ message: 'Logged in successfully', token });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export { loginUser, registerUser };
