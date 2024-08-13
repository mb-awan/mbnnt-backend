import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import { EmailPath } from './emailRoute';
import {
  deleteEmailValidationSchema,
  validationEmailQuerySchema,
  validationEmailSchema,
  validationEmailSendSchema,
  validationEmailUpdateSchema,
} from './emailSchema';

export const EmailRegistry = new OpenAPIRegistry();

// get all Email

EmailRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all Email entries:
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all Email entries from the database.
  `,
  path: `${apiRoutes.email}${EmailPath.getAll}`,
  request: {
    query: validationEmailQuerySchema,
  },
  tags: ['Email'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Get all Emails successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            Email: validationEmailSchema,
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
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            error: z.object({}).nullable().optional(),
          }),
        },
      },
    },
  },
});

// get single Email

EmailRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single Email entry by its ID:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Fetch a Email entry from the database.
      `,
  path: `${apiRoutes.email}${EmailPath.getSingle}`,
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Email'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Email entry fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            EmailEntry: validationEmailSchema,
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
    404: {
      description: 'Email entry not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
            success: z.boolean(),
            error: z.object({}).nullable().optional(),
          }),
        },
      },
    },
  },
});

// create Email

EmailRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new Email entry:
          - Validation: Validate the request body fields .
          - Database Interaction: Save the new Email entry to the database.
      `,
  path: `${apiRoutes.email}${EmailPath.create}`,
  request: {
    body: {
      description: 'Email details',
      content: {
        'application/json': {
          schema: validationEmailSchema,
        },
      },
    },
  },
  tags: ['Email'],
  security: [{ bearerAuth: [] }],

  responses: {
    201: {
      description: 'Email entry created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            Email: validationEmailSchema,
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
    409: {
      description: 'Conflict',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
            success: z.boolean(),
            error: z.object({}).nullable().optional(),
          }),
        },
      },
    },
  },
});

// update Email

EmailRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing Email entry:
          - Validation: Validate the request body fields .
          - Database Interaction: Update the Email entry in the database.
      `,
  path: `${apiRoutes.email}${EmailPath.update}`,
  request: {
    query: z.object({ id: z.string() }),

    body: {
      description: 'Email details',
      content: {
        'application/json': {
          schema: validationEmailUpdateSchema,
        },
      },
    },
  },
  tags: ['Email'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Email entry updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            Email: validationEmailUpdateSchema,
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
    409: {
      description: 'Conflict',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
            success: z.boolean(),
            error: z.object({}).nullable().optional(),
          }),
        },
      },
    },
  },
});

// delete Email

EmailRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing Email entry:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the Email entry from the database.
      `,
  path: `${apiRoutes.email}${EmailPath.delete}`,
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Email'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Contact deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            Email: deleteEmailValidationSchema,
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
    404: {
      description: 'Contact not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
            success: z.boolean(),
            error: z.object({}).nullable().optional(),
          }),
        },
      },
    },
  },
});

// delete Email

EmailRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows to send an Email :
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the Email entry from the database.
      `,
  path: `${apiRoutes.email}${EmailPath.sendEmail}`,
  request: {
    body: {
      description: 'Email details',
      content: {
        'application/json': {
          schema: validationEmailSendSchema,
        },
      },
    },
  },
  tags: ['Email'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'Contact deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            // Email: deleteEmailValidationSchema,
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
    404: {
      description: 'Contact not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
            success: z.boolean(),
            error: z.object({}).nullable().optional(),
          }),
        },
      },
    },
  },
});
