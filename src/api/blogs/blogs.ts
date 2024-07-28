import express, { Router } from 'express';

import { createBlog, deleteBlog, editBlog, getAllBlogs, getsingleBlog } from '@/common/controllers/blogs';
import { validateRequest } from '@/common/utils/httpHandlers';

import { BlogSchema, BlogSchemaEdit, ValidateQueryParamSchema } from './blogSchemas';

const blogsRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-blog', validateRequest(ValidateQueryParamSchema), getAllBlogs);
  router.get('/get-single-blog', getsingleBlog);
  router.post('/create-blog', validateRequest(BlogSchema), createBlog);
  router.put('/edit-blog', validateRequest(BlogSchemaEdit), editBlog);
  router.delete('/delete-blog', deleteBlog);

  return router;
})();

export { blogsRouter };
