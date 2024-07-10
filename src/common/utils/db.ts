import mongoose from 'mongoose';

import { logger } from '@/server';

import { env } from './envConfig';

const { MONGO_URL } = env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    logger.info('Connected to Mongo DB');
  })
  .catch((err) => {
    console.error(err);
  });
