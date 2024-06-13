import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '@/common/models/userModel';

const registerUser = async (req: any, res: any) => {
  const userModel = new User(req.body);
  userModel.password = await bcrypt.hashSync(req.body.password, 10);
  try {
    const response = await userModel.save();
    response.password = '';
    res.status(201).json({ messege: 'success', data: response });
  } catch (error) {
    res.status(500).json({ messege: 'error', data: error });
  }
};

const loginUser = async (req: any, res: any) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const jwtobject = {
      _id: user._id,
      name: user.firstName,
      email: user.email,
      password: user.password,
    };

    const jwtToken = jwt.sign(jwtobject, 'mySecret', { expiresIn: '4h' });
    return res.status(201).json({ jwtToken, jwtobject });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { loginUser, registerUser };
