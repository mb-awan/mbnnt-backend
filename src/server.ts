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

import { blogCategoryRouter } from './api/blogCategory/blogCategoryRoute';
import { blogsRouter } from './api/blogs/blogsRoute';
import { contactUsRouter } from './api/contactUs/contactUsRoute';
import { emailRoute } from './api/email/emailRoute';
import { faqRouter } from './api/faq/faqRoute';
import { feedbackRouter } from './api/feedback/feedbackRoute';
import { newsLetterRoutes } from './api/newsLetter/newsLetterRoutes';
import { notificationRoutes } from './api/notification/notificationRoutes';
import { PermissionRouter } from './api/permission/premissionRoute';
import { PlansRouter } from './api/plans/plansRoutes';
import { roleRouter } from './api/role/roleRoute';
import { siteInfoRouter } from './api/siteInfo/siteInfoRoute';
import { subscriptionRouter } from './api/subscription/subscriptionRoute';
import { userRouter } from './api/user/userRoutes';
import { apiRoutes } from './common/constants/common';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors({ origin: env.CORS_ORIGIN?.split(';'), credentials: true }));

app.use(helmet());

app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// health-check route
app.use(apiRoutes.healthCheck, healthCheckRouter);

// auth route
app.use(apiRoutes.auth, authRoutes);

// users route
app.use(apiRoutes.users, userRouter);

// admins route
app.use(apiRoutes.admins, adminRouter);

// roles route
app.use(apiRoutes.roles, roleRouter);

// permissions route
app.use(apiRoutes.permissions, PermissionRouter);

// newsLetter route
app.use(apiRoutes.newsLetters, newsLetterRoutes);

// create a contact us route
app.use(apiRoutes.contactUs, contactUsRouter);

// create a blog route
app.use(apiRoutes.blogs, blogsRouter);

// create a blog category route
app.use(apiRoutes.blogCategories, blogCategoryRouter);

// create faq route
app.use(apiRoutes.faqs, faqRouter);

// create feedback route
app.use(apiRoutes.feedbacks, feedbackRouter);

// create notification route
app.use(apiRoutes.notifications, notificationRoutes);

// create plan route
app.use(apiRoutes.plans, PlansRouter);

// create subscription route
app.use(apiRoutes.subscriptions, subscriptionRouter);

// create siteInfo
app.use(apiRoutes.siteInfo, siteInfoRouter);

// create email

app.use(apiRoutes.email, emailRoute);

// static file
app.use('/public', express.static(path.join(__dirname, 'public')));

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
