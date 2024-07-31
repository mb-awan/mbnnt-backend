import ServerlessHttp from 'serverless-http';

import { app } from '../../src/server';

export const handler = ServerlessHttp(app);
