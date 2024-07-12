import express, { Router } from 'express';

import {
  createNewsLetter,
  deleteNewsLetter,
  getNewsLetterById,
  getNewsLetters,
  updateNewsLetter,
} from '@/common/controllers/newsLetter';
import { isAdmin } from '@/common/middleware/admin';
import { authenticate } from '@/common/middleware/auth';
import { newsletterSchema } from '@/common/middleware/newsLetter';
import { validateRequest } from '@/common/utils/httpHandlers';

export const newsLetterRoutes: Router = (() => {
  const router = express.Router();

  router.post('/', authenticate, isAdmin, validateRequest(newsletterSchema), createNewsLetter);
  router.put('/:id', authenticate, isAdmin, validateRequest(newsletterSchema), updateNewsLetter);
  router.get('/:id', authenticate, isAdmin, getNewsLetterById);
  router.get('/', authenticate, isAdmin, getNewsLetters);
  router.delete('/:id', authenticate, isAdmin, deleteNewsLetter);

  return router;
})();
