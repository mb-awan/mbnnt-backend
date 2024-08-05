import express, { Router } from 'express';

import { CommonPermissions } from '@/common/constants/enums';
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  getsingleCategory,
} from '@/common/controllers/blogCategory';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import {
  DeleteBlogCategoryValidationSchema,
  UpdateBlogCategoryValidationSchema,
  ValidateBlogCategoryQuerySchema,
  ValidationBlogCategorySchema,
} from './blogCategorySchemas';

export const blogCategoryPaths = {
  getAll: '/',
  getSingle: '/get-single',
  create: '/',
  update: '/',
  delete: '/',
};

export const blogCategoryRouter: Router = (() => {
  const router = express.Router();

  router.get(
    blogCategoryPaths.getAll,
    authenticate,
    hasPermission(CommonPermissions.READ_ALL_BLOG_CATEGORY),
    validateRequest(ValidateBlogCategoryQuerySchema),
    getAllCategory
  );

  router.get(
    blogCategoryPaths.getSingle,
    authenticate,
    hasPermission(CommonPermissions.READ_BLOG_CATEGORY),
    getsingleCategory
  );

  router.post(
    blogCategoryPaths.create,
    authenticate,
    hasPermission(CommonPermissions.CREATE_BLOG_CATEGORY),
    validateRequest(ValidationBlogCategorySchema),
    createCategory
  );

  router.put(
    blogCategoryPaths.update,
    authenticate,
    hasPermission(CommonPermissions.UPDATE_BLOG_CATEGORY),
    validateRequest(UpdateBlogCategoryValidationSchema),
    editCategory
  );

  router.delete(
    blogCategoryPaths.delete,
    authenticate,
    hasPermission(CommonPermissions.DELETE_BLOG_CATEGORY),
    validateRequest(DeleteBlogCategoryValidationSchema),
    deleteCategory
  );

  return router;
})();
