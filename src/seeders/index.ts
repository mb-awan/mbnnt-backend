import mongoose from 'mongoose';

import { env } from '@/common/utils/envConfig';

import seedPermissions from './seedPermissions';
import seedRoles from './seedRoles';
import seedUsers from './seedUsers';

const { MONGO_URL } = env;

const seedDatabase = async () => {
  mongoose
    .connect(MONGO_URL)
    .then(async () => {
      console.log('Connected to Mongo DB');
      await seedPermissions();
      await seedRoles();
      await seedUsers();
    })
    .catch((err) => {
      console.log('Something went wrong while seeding'), JSON.stringify(err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedDatabase();
