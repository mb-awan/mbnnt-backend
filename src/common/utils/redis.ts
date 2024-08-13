import { createClient } from 'redis';

import { logger } from '@/server';

import { env } from './envConfig';

const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
});

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis', err);
});

redisClient
  .connect()
  .then(async () => {
    logger.info('Connected to Redis');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });
