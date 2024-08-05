import { Plan } from '@/common/models/plans';

import { plans } from './planData';
const seedPlans = async () => {
  try {
    console.log('Seeding plans...');

    await Promise.all(
      plans.map((plan) =>
        Plan.findOneAndUpdate({ name: plan.name }, { ...plan }, { upsert: true, new: true, setDefaultsOnInsert: true })
      )
    );

    console.log('Plans seeded!');
  } catch (err) {
    console.log('Error seeding plans:', err);
    throw new Error('Something went wrong while seeding plans');
  }
};

export default seedPlans;
