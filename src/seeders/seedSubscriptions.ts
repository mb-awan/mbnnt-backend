import { Subscription } from '@/common/models/subscription';

import { subscriptions } from './subscriptionData';

const seedSubscriptions = async () => {
  try {
    console.log('Seeding subscriptions...');

    await Promise.all(
      subscriptions.map((subscription) =>
        Subscription.findOneAndUpdate(
          { user: subscription.user, plan: subscription.plan },
          { ...subscription },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    console.log('Subscriptions seeded!');
  } catch (err) {
    console.log('Error seeding subscriptions:', err);
    throw new Error('Something went wrong while seeding subscriptions');
  }
};

export default seedSubscriptions;
