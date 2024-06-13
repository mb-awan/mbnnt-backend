import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost:27017/mbnntauth')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connectiong while MongoDb'), err;
  });
