import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { NewsletterSchema, NewsletterSchemaEdit, newsLetterSchemaQuery } from './newsLetterSchemas';
export const newsLetterRegistry = new OpenAPIRegistry();

// get all newsLetter

newsLetterRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all newsLetter's :
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all newsLetter's from the database.
  `,
  path: '/newsLetter/get-all-news-letter',
  request: {
    query: newsLetterSchemaQuery,
  },
  tags: ['NewsLetter'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'newsLetter retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            newsLetter: z.array(NewsletterSchema),
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
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// get single newsLetter

newsLetterRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single newsLetter:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Fetch a newsLetter from the database.
      `,
  path: '/newsLetter/get-single-news-letter',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['NewsLetter'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'newsLetter retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            newsLetter: NewsletterSchema,
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
      description: 'newsLetter not found',
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
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// create newsLetter

newsLetterRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new newsLetter:
          - Validation: Validate the request body fields.
          - Database Interaction: Save the new newsLetter to the database.
      `,
  path: '/newsLetter/create-news-letter',
  request: {
    body: {
      description: 'newsLetter detail',
      content: {
        'application/json': {
          schema: NewsletterSchema,
        },
      },
    },
  },
  tags: ['NewsLetter'],
  security: [{ bearerAuth: [] }],

  responses: {
    201: {
      description: 'newsLetter created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            newsLetter: NewsletterSchema,
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
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// update newsLetter

newsLetterRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing newsLetter:
          - Validation: Validate the request body fields.
          - Database Interaction: Update the newsLetter in the database.
      `,
  path: '/newsLetter/edit-news-letter',
  request: {
    query: z.object({ id: z.string() }),
    body: {
      description: 'newsLetter details',
      content: {
        'application/json': {
          schema: NewsletterSchemaEdit,
        },
      },
    },
  },
  tags: ['NewsLetter'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'NewLetter updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
      description: 'Not found',
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
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// delete newsLetter

newsLetterRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing newsLetter:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the newsLetter entry from the database.
      `,
  path: '/newsLetter/delete-news-letter',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['NewsLetter'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'newsLetter deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
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
      description: 'newsLetter not found',
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
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// subscribe newsLetter and unsubscriber not make because of dont have subscribers
