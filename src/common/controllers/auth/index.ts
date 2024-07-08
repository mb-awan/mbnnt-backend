import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import { UserStatus } from '@/common/constants/enums';
import { Role } from '@/common/models/roles';
import { User } from '@/common/models/user';
import { generateToken, hashOTP, hashPassword, isValidPassword } from '@/common/utils/auth';
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

    const userRole = await Role.findOne({ name: req.body.role }).populate({
      path: 'permissions',
      select: '-__v',
    });

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
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messege: 'Error while registering 789', data: error });
  }
};

// const registerUser = async (req: any, res: any) => {
//   try {
//     const { email, username, phone, password, confirmPassword, role, ...rest } = req.body;

//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }, { phone }],
//     });

//     if (existingUser && existingUser.status !== UserStatus.DELETED) {
//       return res
//         .status(StatusCodes.CONFLICT)
//         .json({ message: 'This Email is already associated with an account, please try to login' });
//     }

//     if (password !== confirmPassword) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Passwords must match' });
//     }

//     const hashedPassword = await hashPassword(password);

//     const userRole = await Role.findOne({ name: role }).populate({
//       path: 'permissions',
//       select: '-__v',
//     });

//     if (!userRole) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role' });
//     }

//     const otp = generateOTP(); // generate OTP
//     console.log(otp);
//     const hashedOTP = await hashOTP(otp);

//     let user;

//     if (!existingUser) {
//       user = new User({
//         ...rest,
//         email,
//         username,
//         phone,
//         password: hashedPassword,
//         role: userRole._id as Types.ObjectId,
//         emailVerificationOTP: hashedOTP,
//       });

//       // Send email to user with OTP if the user is not created by the admin
//       // Add email sending logic here

//       user = await user.save();
//     } else {
//       Object.keys(req.body).forEach((key) => {
//         (existingUser as any)[key] = req.body[key];
//       });
//       existingUser.password = hashedPassword;
//       existingUser.status = UserStatus.ACTIVE;
//       existingUser.role = userRole._id as Types.ObjectId;
//       existingUser.emailVerificationOTP = hashedOTP;

//       user = await existingUser.save();
//     }

//     if (!user) {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error while registering' });
//     }

//     const token = await generateToken({ ...user.toObject(), role: userRole });

//     if (!token) {
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message:
//           'You have registered successfully, but unfortunately something went wrong while generating token, so please login with your credentials to get the token',
//       });
//     }

//     return res.status(StatusCodes.OK).json({ message: 'Registered successfully', token });
//   } catch (error) {
//     console.error('Detailed error while registering:', error);  // Log the error details
//     logger.error('Error while registering', JSON.stringify(error) || error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error while registering', data: error });
//   }
// };

const loginUser = async (req: any, res: any) => {
  try {
    const { email, username, phone } = req.body;
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
      populate: {
        path: 'permissions',
        model: 'Permission',
        select: '-__v',
      },
    });

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
