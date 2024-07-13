import express, { Router } from 'express';

import {
  createNewsLetter,
  deleteNewsLetter,
  getNewsLetterById,
  getNewsLetters,
  subscribeToNewsLetter,
  unSubscribeToNewsLetter,
  updateNewsLetter,
} from '@/common/controllers/newsLetter';
import { isAdmin } from '@/common/middleware/admin';
import { authenticate } from '@/common/middleware/auth';
import { newsletterSchema } from '@/common/middleware/newsLetter';
import { validateRequest } from '@/common/utils/httpHandlers';

export const newsLetterRoutes: Router = (() => {
  const router = express.Router();

  router.get('/all', authenticate, isAdmin, getNewsLetters);
  router.get('/get-single', authenticate, isAdmin, getNewsLetterById);
  router.post('/create', authenticate, isAdmin, validateRequest(newsletterSchema), createNewsLetter);
  router.put('/edit', authenticate, isAdmin, validateRequest(newsletterSchema), updateNewsLetter);
  router.delete('/delete', authenticate, isAdmin, deleteNewsLetter);

  router.patch('/subscribe', authenticate, subscribeToNewsLetter);
  router.patch('/unSubscribe', authenticate, unSubscribeToNewsLetter);

  return router;
})();
