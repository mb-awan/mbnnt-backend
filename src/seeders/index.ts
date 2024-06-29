import mongoose from 'mongoose';

import { env } from '@/common/utils/envConfig';

import seedPermissions from './seedPermissions';
import seedRoles from './seedRoles';

const { MONGO_URL } = env;

const seedDatabase = async () => {
  mongoose
    .connect(MONGO_URL)
    .then(async () => {
      console.log('Connected to Mongo DB');
      await seedPermissions();
      await seedRoles();
    })
    .catch((err) => {
      console.log('Error connecting to Mongo DB'), JSON.stringify(err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedDatabase();
