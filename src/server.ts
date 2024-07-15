// import database
import '@/common/utils/db';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import path from 'path';
import { pino } from 'pino';

import { adminRouter } from '@/api/admin/adminRoute';
import { authRoutes } from '@/api/auth/authRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

import { blogCategoryRouter } from './api/blogCategory/blogCategory';
import { blogsRouter } from './api/blogs/blogs';
import { contactUsRouter } from './api/contactUs/contactUs';
import { newsLetterRoutes } from './api/newsLetter/newsLetterRoutes';
import { PermissionRouter } from './api/permission/premissionroute';
import { roleRouter } from './api/role/roleroute';
import { userRouter } from './api/user/userRoutes';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// create a health-check route
app.use('/health-check', healthCheckRouter);

// create a auth route
app.use('/auth', authRoutes);

// create a user route
app.use('/user', userRouter);

// create a admin route
app.use('/admin', adminRouter);

// create a role route
app.use('/role', roleRouter);

// create a permission routess

app.use('/permission', PermissionRouter);

// newsLetter route

app.use('/newsLetter', newsLetterRoutes);
// create a contact us route

app.use('/contact-us', contactUsRouter);

// create a blog route

app.use('/blog', blogsRouter);

// create a blog category route

app.use('/blog-category', blogCategoryRouter);

// static file
app.use('/public', express.static(path.join(__dirname, 'public')));

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
