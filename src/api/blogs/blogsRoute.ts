import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import { createBlog, deleteBlog, editBlog, getAllBlogs, getsingleBlog } from '@/common/controllers/blogs';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteBlogValidationSchema,
  UpdateBlogValidationSchema,
  ValidationBlogQuerySchema,
  ValidationBlogSchema,
} from './blogSchemas';

export const blogPaths = {
  getAll: '/get-all-blog',
  getSingle: '/get-single-blog',
  create: '/create-blog',
  update: '/update-blog',
  delete: '/delete-blog',
};

const blogsRouter: Router = (() => {
  const router = express.Router();

  router.get(
    blogPaths.getAll,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_BLOG),
    validateRequest(ValidationBlogQuerySchema),
    getAllBlogs
  );

  router.get(blogPaths.getSingle, authenticate, hasPermission(CommonPermissions.READ_ALL_BLOG), getsingleBlog);

  router.post(
    blogPaths.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_BLOG),
    validateRequest(ValidationBlogSchema),
    createBlog
  );

  router.put(
    blogPaths.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_BLOG),
    validateRequest(UpdateBlogValidationSchema),
    editBlog
  );

  router.delete(
    blogPaths.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_BLOG),
    validateRequest(DeleteBlogValidationSchema),
    deleteBlog
  );

  return router;
})();

export { blogsRouter };
