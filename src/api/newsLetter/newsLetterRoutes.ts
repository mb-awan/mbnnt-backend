import express, { Router } from 'express';

import { AdminPermissions, CommonPermissions } from '@/common/constants/enums';
import {
  createNewsLetter,
  deleteNewsLetter,
  getallNewsLetters,
  getNewsLetterById,
  subscribeToNewsLetter,
  unSubscribeToNewsLetter,
  updateNewsLetter,
} from '@/common/controllers/newsLetter';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteNewsletterValidationSchema,
  UpdatedNewsletterSchema,
  ValidationNewsLetterQuerySchema,
  ValidationNewsletterSchema,
} from './newsLetterSchemas';

export const NewsLetterPaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
  subscribe: '/subscribe',
  unSubscribe: '/unsubscribe',
};

export const newsLetterRoutes: Router = (() => {
  const router = express.Router();

  router.get(
    NewsLetterPaths.getAll,
    authenticate,
    hasPermission(AdminPermissions.READ_ALL_NEWS_LETTERS),
    validateRequest(ValidationNewsLetterQuerySchema),
    getallNewsLetters
  );

  router.get(
    NewsLetterPaths.getSingle,
    authenticate,
    hasPermission(AdminPermissions.READ_ANY_NEWS_LETTER),
    getNewsLetterById
  );

  router.post(
    NewsLetterPaths.create,
    authenticate,
    hasPermission(AdminPermissions.CREATE_NEWS_LETTER),
    validateRequest(ValidationNewsletterSchema),
    createNewsLetter
  );

  router.put(
    NewsLetterPaths.update,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_NEWS_LETTER),
    validateRequest(UpdatedNewsletterSchema),
    updateNewsLetter
  );

  router.delete(
    NewsLetterPaths.delete,
    authenticate,
    hasPermission(AdminPermissions.DELETE_NEWS_LETTER),
    validateRequest(DeleteNewsletterValidationSchema),
    deleteNewsLetter
  );

  router.patch(
    NewsLetterPaths.subscribe,
    authenticate,
    hasPermission(CommonPermissions.SUBSCRIBE_NEWS_LETTER),
    subscribeToNewsLetter
  );

  router.patch(
    NewsLetterPaths.unSubscribe,
    authenticate,
    hasPermission(CommonPermissions.UNSUBSCRIBE_NEWS_LETTER),
    unSubscribeToNewsLetter
  );

  return router;
})();
