import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '@/common/models/user';

import { env } from '../../utils/envConfig';

const { SECRET_KEY } = env;

const registerUser = async (req: any, res: any) => {
  try {
    const userModel = new User(req.body);
    userModel.password = await bcrypt.hashSync(req.body.password, 10);
    const newUser = await userModel.save();

    if (!newUser) {
      return res.status(400).json({ messege: 'Bad Request' });
    }

    const payload = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    res.status(201).json({ messege: 'success', token });
  } catch (error) {
    res.status(500).json({ messege: 'error', data: error });
  }
};

const loginUser = async (req: any, res: any) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { loginUser, registerUser };
