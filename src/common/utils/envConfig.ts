import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly, url } from 'envalid';
import fs from 'fs';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn(`Environment file ${envFile} not found`);
}

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:*') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGO_URL: url({ devDefault: testOnly('mongodb://localhost:27017/mbnnt-db') }),
  SECRET_KEY: str({ devDefault: testOnly('mySecret') }),
  Expire: str({ devDefault: testOnly('1d') }),
});
