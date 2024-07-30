import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import { createSiteInfo, deleteSiteInfo, getSiteInfo, updateSiteInfo } from '@/common/controllers/siteInfo';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import { SiteInfoSchema, UpdateSiteInfoSchema } from './siteInfoSchema';

export const siteInfoPaths = {
  get: '/get-site-info',
  create: '/create-site-info',
  update: '/update-site-info',
  delete: '/delete-site-info',
};

export const siteInfoRouter: Router = (() => {
  const router = express.Router();

  router.get(siteInfoPaths.get, authenticate, hasPermission(AdminPermissions.READ_SITEINFO), getSiteInfo);
  router.post(
    siteInfoPaths.create,
    authenticate,
    hasPermission(AdminPermissions.CREATE_SITEINFO),
    validateRequest(SiteInfoSchema),
    createSiteInfo
  );
  router.put(
    siteInfoPaths.update,
    authenticate,
    hasPermission(AdminPermissions.UPDATE_SITEINFO),
    validateRequest(UpdateSiteInfoSchema),
    updateSiteInfo
  );
  router.delete(siteInfoPaths.delete, authenticate, hasPermission(AdminPermissions.DELETE_SITEINFO), deleteSiteInfo);

  return router;
})();
