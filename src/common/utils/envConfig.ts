// import dotenv from 'dotenv';
import { config as dotEnvConfig } from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly, url } from 'envalid';
import fs from 'fs';

// // dotenv files
enum ENVIRONMENT {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

const loadEnvFile = () => {
  switch (process.env['NODE_ENV']) {
    case ENVIRONMENT.PRODUCTION:
      if (fs.existsSync('.env.production')) {
        // eslint-disable-next-line global-require
        dotEnvConfig({ path: '.env.production' });
      } else {
        // eslint-disable-next-line global-require
        dotEnvConfig({ path: '.env' });
      }
      break;
    case ENVIRONMENT.TEST:
      // eslint-disable-next-line global-require
      dotEnvConfig({ path: '.env.test' });
      break;
    case ENVIRONMENT.DEVELOPMENT:
      // eslint-disable-next-line global-require
      dotEnvConfig({ path: '.env.development' });
      break;
    default:
      // eslint-disable-next-line global-require
      dotEnvConfig({ path: '.env.development' });
  }
};

loadEnvFile();

// dotenv.config( {path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'});
// console.log(`Running in ${process.env.NODE_ENV} mode`);

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:*') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGO_URL: url({ devDefault: testOnly('mongodb://localhost:27017/mbnnt-db') }),
  SECRET_KEY: str({ devDefault: testOnly('mySecret') }),
});
