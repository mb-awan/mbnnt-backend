import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { siteInfoPaths } from './siteInfoRoute';
import { GetSiteInfoSeachValidationSchema, SiteInfoSchema, UpdateSiteInfoSchema } from './siteInfoSchema';

export const siteInfoRegistry = new OpenAPIRegistry();

// siteInfo Details

siteInfoRegistry.registerPath({
  method: 'get',
  description: `
      This endpoint retrieves the siteInfo information:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the siteInfo's email to be verified.
          - Phone Verification: Requires the siteInfo's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role.
      `,
  path: `/site-info${siteInfoPaths.get}`,
  tags: ['SiteInfo'],
  security: [{ bearerAuth: [] }],
  request: {
    query: GetSiteInfoSeachValidationSchema,
  },

  responses: {
    200: {
      description: 'siteInfo fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            siteInfos: SiteInfoSchema,
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// create new siteInfo

siteInfoRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint Creates siteInfo :
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the siteInfo's email to be verified.
          - Phone Verification: Requires the siteInfo's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role. 
      `,
  path: `/site-info${siteInfoPaths.create}`,
  tags: ['SiteInfo'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      description: 'Create new  siteInfo ',
      content: {
        'application/json': {
          schema: SiteInfoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'siteInfo Created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            siteInfo: SiteInfoSchema,
            success: z.boolean().default(true),
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// update siteInfo profile

siteInfoRegistry.registerPath({
  method: 'put',
  description: `
    This endpoint updates siteInfo information:
     - Authentication: Requires a valid JWT token.
     - Email Verification: Requires the siteInfo's email to be verified.
     - Phone Verification: Requires the siteInfo's phone number to be verified.
     - Admin Role: Requires the requester to have the admin role.
  `,
  path: `/site-info${siteInfoPaths.update}`,
  tags: ['SiteInfo'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
    body: {
      description: 'siteInfo profile update details',
      content: {
        'application/json': {
          schema: UpdateSiteInfoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'siteInfo updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            siteInfo: UpdateSiteInfoSchema,
            success: z.boolean().default(true),
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// Delete siteInfo

siteInfoRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint deletes the siteInfo account:
          - Authentication: Requires a valid JWT token.
          - Email Verification: Requires the siteInfo's email to be verified.
          - Phone Verification: Requires the siteInfo's phone number to be verified.
          - Admin Role: Requires the requester to have the admin role.
      `,
  path: `/site-info${siteInfoPaths.delete}`,
  tags: ['SiteInfo'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      id: z.string().optional(),
    }),
    body: {
      description: 'siteInfo account deletion details',
      content: {
        'application/json': {
          schema: SiteInfoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'siteInfo deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(true),
            siteInfo: SiteInfoSchema,
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Not authorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean().default(false),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});
