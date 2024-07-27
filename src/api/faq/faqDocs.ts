import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { faqSchema, faqSchemaQuery } from './faqSchema';

export const faqRegistry = new OpenAPIRegistry();

// get all FAQ

faqRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all faq's :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all faq's from the database.
  `,
  path: '/faq/get-all-faq',
  request: {
    query: faqSchemaQuery,
  },
  tags: ['FAQ'],
  responses: {
    200: {
      description: 'Faqs fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            faq: z.array(faqSchema),
            currentPage: z.number(),
            totalPages: z.number(),
            totalCount: z.number(),
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

// get single FAQ

faqRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single FAQ  by its ID:
          - Validation: Validate the FAQ ID query parameter.
          - Database Interaction: Fetch a FAQ  from the database.
      `,
  path: '/faq/get-single-faq',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['FAQ'],
  responses: {
    200: {
      description: 'FAQ retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            faq: faqSchema,
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
    404: {
      description: 'Not found',
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

// create FAQ

faqRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new FAQ   :
          - Validation: Validate the request body fields .
          - Database Interaction: Save the new FAQ to the database.
      `,
  path: '/faq/create-faq',
  request: {
    body: {
      description: 'FAQ detail',
      content: {
        'application/json': {
          schema: faqSchema,
        },
      },
    },
  },
  tags: ['FAQ'],
  responses: {
    201: {
      description: 'Faq created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            faq: faqSchema,
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
            success: z.boolean().default(false),
            message: z.string(),
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

// update FAQ

faqRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing FAQ :
          - Validation: Validate the request body fields.
          - Database Interaction: Update the FAQ in the database.
      `,
  path: '/faq/edit-faq',
  request: {
    query: z.object({ id: z.string() }),

    body: {
      description: 'FAQ details',
      content: {
        'application/json': {
          schema: faqSchema,
        },
      },
    },
  },
  tags: ['FAQ'],
  responses: {
    200: {
      description: 'FAQ updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            faq: faqSchema,
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
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
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

// delete FAQ

faqRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing FAQ   :
          - Validation: Validate the FAQ fields to be deleted.
          - Database Interaction: Delete the FAQ from the database.
      `,
  path: '/faq/delete-faq',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['FAQ'],
  responses: {
    200: {
      description: 'FAQ deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'FAQ not found',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
          }),
        },
      },
    },
  },
});
