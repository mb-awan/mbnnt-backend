import { Role } from '@/common/models/roles';
import { User } from '@/common/models/user';
import { hashPassword } from '@/common/utils/auth';

import { users } from './data';

const seedUsers = async () => {
  try {
    const roles = await Role.find({});

    if (roles.length === 0) {
      console.log('Please seed roles first');
      return;
    }

    const roleMap = roles.reduce(
      (map, role) => {
        map[role.name] = role._id;
        return map;
      },
      {} as { [key: string]: any }
    );

    await Promise.all(
      users.map(async (user) =>
        User.findOneAndUpdate(
          { email: user.email },
          {
            ...user,
            password: await hashPassword(user.password),
            role: roleMap[user.role],
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    console.log('Users seeded!');
  } catch (err) {
    console.log(err);
    throw new Error('Something went wrong while seeding users');
  }
};

export default seedUsers;
