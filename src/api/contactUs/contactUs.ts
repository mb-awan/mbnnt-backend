import express, { Router } from 'express';

import {
  createContactUs,
  deleteContactUsById,
  getAllContactUs,
  getContactUsById,
  updateContactUsById,
} from '@/common/controllers/contactUs';
import { contactUsSchema, contactUsSchemaEdit } from '@/common/middleware/contactUs';
import { validateRequest } from '@/common/utils/httpHandlers';

export const contactUsRouter: Router = (() => {
  const router = express.Router();
  router.post('/add', validateRequest(contactUsSchema), createContactUs);
  router.get('/all', getAllContactUs);
  router.get('/single', getContactUsById);
  router.put('/edit', validateRequest(contactUsSchemaEdit), updateContactUsById);
  router.delete('/delete', deleteContactUsById);

  return router;
})();
