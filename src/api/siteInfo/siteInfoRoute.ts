import express, { Router } from 'express';

import { AdminPermissions } from '@/common/constants/enums';
import { createSiteInfo, deleteSiteInfo, getSiteInfo, updateSiteInfo } from '@/common/controllers/siteInfo';
import { authenticate, hasPermission } from '@/common/middleware/user';
import { validateRequest } from '@/common/utils/httpHandlers';

import { GetSiteInfoValidationSchema, SiteInfoSchema, UpdateSiteInfoSchema } from './siteInfoSchema';

export const siteInfoPaths = {
  get: '/',
  create: '/',
  update: '/',
  delete: '/',
};

export const siteInfoRouter: Router = (() => {
  const router = express.Router();

  router.get(
    siteInfoPaths.get,
    authenticate,
    hasPermission(AdminPermissions.READ_SITEINFO),
    validateRequest(GetSiteInfoValidationSchema),
    getSiteInfo
  );

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
