import express, { Router } from 'express';

import {
  createFeedback,
  deleteFeedback,
  editFeedback,
  getAllFeedback,
  getsingleFeedback,
} from '@/common/controllers/feedback';
import { validateRequest } from '@/common/utils/httpHandlers';

import { feedbackSchema, feedbackSchemaEdit, feedbackSchemaQuery } from './feedbackSchema';

const feedbackRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-feedback', validateRequest(feedbackSchemaQuery), getAllFeedback);
  router.get('/get-single-feedback', getsingleFeedback);
  router.post('/create-feedback', validateRequest(feedbackSchema), createFeedback);
  router.put('/edit-feedback', validateRequest(feedbackSchemaEdit), editFeedback);
  router.delete('/delete-feedback', deleteFeedback);

  return router;
})();

export { feedbackRouter };
