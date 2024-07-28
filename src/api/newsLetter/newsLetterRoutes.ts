import express, { Router } from 'express';

import {
  createNewsLetter,
  deleteNewsLetter,
  getallNewsLetters,
  getNewsLetterById,
  subscribeToNewsLetter,
  unSubscribeToNewsLetter,
  updateNewsLetter,
} from '@/common/controllers/newsLetter';
import { isAdmin } from '@/common/middleware/admin';
import { authenticate } from '@/common/middleware/auth';
import { validateRequest } from '@/common/utils/httpHandlers';

import { NewsletterSchema, NewsletterSchemaEdit, newsLetterSchemaQuery } from './newsLetterSchemas';

export const newsLetterRoutes: Router = (() => {
  const router = express.Router();

  router.get('/get-all-news-letter', authenticate, isAdmin, validateRequest(newsLetterSchemaQuery), getallNewsLetters);
  router.get('/get-single-news-letter', authenticate, isAdmin, getNewsLetterById);
  router.post('/create-news-letter', authenticate, isAdmin, validateRequest(NewsletterSchema), createNewsLetter);
  router.put('/edit-news-letter', authenticate, isAdmin, validateRequest(NewsletterSchemaEdit), updateNewsLetter);
  router.delete('/delete-news-letter', authenticate, isAdmin, deleteNewsLetter);

  router.patch('/subscribe-news-letter', authenticate, subscribeToNewsLetter);
  router.patch('/unSubscribe-news-letter', authenticate, unSubscribeToNewsLetter);

  return router;
})();
