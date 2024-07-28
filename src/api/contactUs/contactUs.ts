import express, { Router } from 'express';

import {
  createContactUs,
  deleteContactUsById,
  getAllContactUs,
  getContactUsById,
  updateContactUsById,
} from '@/common/controllers/contactUs';
import { validateRequest } from '@/common/utils/httpHandlers';

import { ContactUsQuery, ContactUsSchema, ContactUsSchemaEdit } from './contactUsSchemas';

export const contactUsRouter: Router = (() => {
  const router = express.Router();
  router.get('/get-all-contact', validateRequest(ContactUsQuery), getAllContactUs);
  router.get('/get-single-contact', getContactUsById);
  router.post('/create-contact', validateRequest(ContactUsSchema), createContactUs);
  router.put('/edit-contact', validateRequest(ContactUsSchemaEdit), updateContactUsById);
  router.delete('/delete-contact', deleteContactUsById);

  return router;
})();
