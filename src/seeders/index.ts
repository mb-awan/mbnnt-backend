import mongoose from 'mongoose';

import { env } from '@/common/utils/envConfig';

import seedPermissions from './seedPermissions';
import seedPlans from './seedPlan';
import seedRoles from './seedRoles';
import seedSiteInfos from './seedSiteInfos';
import seedSubscriptions from './seedSubscriptions';
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
      await seedPlans();
      await seedSubscriptions();
      await seedSiteInfos();
    })
    .catch((err) => {
      console.log('Something went wrong while seeding'), JSON.stringify(err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedDatabase();
