import express, { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  getsingleCategory,
} from '@/common/controllers/blogCategory';
import { zodBlogCategory } from '@/common/middleware/blogCategory';
import { validateRequest } from '@/common/utils/httpHandlers';

const blogCategoryRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-category', getAllCategory);
  router.get('/get-single-category', getsingleCategory);
  router.post('/create-category', validateRequest(zodBlogCategory), createCategory);
  router.put('/edit-category', validateRequest(zodBlogCategory), editCategory);
  router.delete('/delete-category', deleteCategory);

  return router;
})();

export { blogCategoryRouter };
