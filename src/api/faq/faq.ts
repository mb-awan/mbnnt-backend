import express, { Router } from 'express';

import { createFaq, deleteFaq, editFaq, getAllFaq, getsingleFaq } from '@/common/controllers/faq';
import { faqSchema } from '@/common/middleware/faq';
import { validateRequest } from '@/common/utils/httpHandlers';

const faqRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-faq', getAllFaq);
  router.get('/get-single-faq', getsingleFaq);
  router.post('/create-faq', validateRequest(faqSchema), createFaq);
  router.put('/edit-faq', validateRequest(faqSchema), editFaq);
  router.delete('/delete-faq', deleteFaq);

  return router;
})();

export { faqRouter };
