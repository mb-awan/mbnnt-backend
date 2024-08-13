import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly, url } from 'envalid';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error(`Environment file .env.${process.env.NODE_ENV} not found`);
}

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'staging', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3001;http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGO_URL: url({ devDefault: testOnly('mongodb://localhost:27017/mbnnt-db') }),
  JWT_SECRET_KEY: str({ devDefault: testOnly('mySecret') }),
  JWT_EXPIRES_IN: str({ devDefault: testOnly('1d') }),
  BCRYPT_SALT_ROUNDS: num({ devDefault: testOnly(10) }),

  // cloudinary
  CLOUDINARY_CLOUD_NAME: str({ devDefault: testOnly(''), desc: 'Cloudinary cloud name' }),
  CLOUDINARY_API_KEY: str({ devDefault: testOnly(''), desc: 'Cloudinary api key' }),
  CLOUDINARY_API_SECRET: str({ devDefault: testOnly(''), desc: 'Cloudinary api secret' }),

  // REDIS
  REDIS_HOST: str({ devDefault: testOnly('127.0.0.1') }),
  REDIS_PORT: num({ devDefault: testOnly(6379) }),
});
