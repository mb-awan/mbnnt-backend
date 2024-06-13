import mongoose from 'mongoose';

import { env } from './envConfig';
const { MONGO_URL } = env;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connectiong while MongoDb'), err;
  });
