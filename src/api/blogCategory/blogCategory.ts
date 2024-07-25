import express, { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  getsingleCategory,
} from '@/common/controllers/blogCategory';
import { validateRequest } from '@/common/utils/httpHandlers';

import { BlogCategory, BlogCategoryQuery } from './blogCategorySchemas';

export const blogCategoryRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-category', validateRequest(BlogCategoryQuery), getAllCategory);
  router.get('/get-single-category', getsingleCategory);
  router.post('/create-category', validateRequest(BlogCategory), createCategory);
  router.put('/edit-category', validateRequest(BlogCategory), editCategory);
  router.delete('/delete-category', deleteCategory);

  return router;
})();
