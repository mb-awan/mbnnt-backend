// src/seeder/seederSubscription.ts
import { Plan } from '@/common/models/plans';
import { Subscription } from '@/common/models/subscription';
import { User } from '@/common/models/user';

import { subscriptions } from './subscriptionData';

const seedSubscriptions = async () => {
  try {
    console.log('Seeding subscriptions...');

    await Promise.all(
      subscriptions.map(async (subscription) => {
        const user = await User.findOne({ username: subscription.user });
        const plan = await Plan.findOne({ name: subscription.plan });

        if (!user || !plan) {
          console.log(
            `Skipping subscription for user: ${subscription.user}, plan: ${subscription.plan} - user or plan not found`
          );
          return;
        }

        await Subscription.findOneAndUpdate(
          { user: user._id, plan: plan._id },
          { ...subscription, user: user._id, plan: plan._id },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      })
    );

    console.log('Subscriptions seeded!');
  } catch (err) {
    console.log('Error seeding subscriptions:', err);
    throw new Error('Something went wrong while seeding subscriptions');
  }
};

export default seedSubscriptions;
