import '@/common/utils/db';

import bodyParser from 'body-parser';

import { routes } from '@/common/routes';
import { env } from '@/common/utils/envConfig';
import { app, logger } from '@/server';

app.use(bodyParser.json());

// create a user route
app.use('/user', routes);

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');
  server.close(() => {
    logger.info('server closed');
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
