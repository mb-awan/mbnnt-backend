import { decodedUser } from '@/common/middleware/userAuth';
import { User } from '@/common/models/user';

// show single user with jwt token
const showUser = (req: any, res: any) => {
  if (!decodedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(201).json(decodedUser);
};

// edit user data

const editUser = async (req: any, res: any) => {
  const id = decodedUser.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;

  const updateUser = await user.save();
  updateUser.password = '';
  console.log('user updated successfull', updateUser);
  res.status(200).json({ messege: 'Successfull', updateUser });
};

// delete user

const deleteUser = async (req: any, res: any) => {
  const id = decodedUser.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.status = 'Deleted';

  const updateUser = await user.save();
  console.log('user updated successfull', updateUser);
  res.status(200).json({
    messege: 'Successfull',
    firstName: updateUser.firstName,
    lastName: updateUser.lastName,
    email: updateUser.email,
    status: updateUser.status,
  });
};

export { deleteUser, editUser, showUser };
