import express, { Router } from 'express';

import { createBlog, deleteBlog, editBlog, getAllBlogs, getsingleBlog } from '@/common/controllers/blogs';
import { blogSchema, blogSchemaEdit } from '@/common/middleware/blogs';
import { validateRequest } from '@/common/utils/httpHandlers';

const blogsRouter: Router = (() => {
  const router = express.Router();

  router.get('/get-all-blog', getAllBlogs);
  router.get('/get-single-blog', getsingleBlog);
  router.post('/create-blog', validateRequest(blogSchema), createBlog);
  router.put('/edit-blog', validateRequest(blogSchemaEdit), editBlog);
  router.delete('/delete-blog', deleteBlog);

  return router;
})();

export { blogsRouter };
