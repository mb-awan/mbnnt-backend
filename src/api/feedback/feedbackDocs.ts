import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { feedbackSchema, feedbackSchemaEdit, feedbackSchemaQuery } from './feedbackSchema';
export const feedbackRegistry = new OpenAPIRegistry();

// get all feedback

feedbackRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all feedback's:
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all feedback's from the database.
  `,
  path: '/feedback/get-all-feedback',
  request: {
    query: feedbackSchemaQuery,
  },
  tags: ['Feedback'],
  responses: {
    200: {
      description: 'Feedbacks fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            feedback: z.array(feedbackSchema),
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

// get single feedback

feedbackRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single feedback by its ID:
          - Validation: Validate the feedback ID query parameter.
          - Database Interaction: Fetch a feedback from the database.
      `,
  path: '/feedback/get-single-feedback',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Feedback'],
  responses: {
    200: {
      description: 'Feedback fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            feedback: feedbackSchema,
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

// create feedback

feedbackRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new feedback :
          - Validation: Validate the request body fields.
          - Database Interaction: Save the new feedback to the database.
      `,
  path: '/feedback/create-feedback',
  request: {
    body: {
      description: 'feedback detail',
      content: {
        'application/json': {
          schema: feedbackSchema,
        },
      },
    },
  },
  tags: ['Feedback'],
  responses: {
    201: {
      description: 'Feedback created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            feedback: feedbackSchema,
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
      description: 'Bad Request',
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

// update feedback

feedbackRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing feedback:
          - Validation: Validate the request body fields.
          - Database Interaction: Update the feedback  in the database.
      `,
  path: '/feedback/edit-feedback',
  request: {
    query: z.object({ id: z.string() }),

    body: {
      description: 'feedback details',
      content: {
        'application/json': {
          schema: feedbackSchemaEdit,
        },
      },
    },
  },
  tags: ['Feedback'],
  responses: {
    200: {
      description: 'Feedback updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            feedback: feedbackSchema,
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
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

// delete feedback

feedbackRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing feedback:
          - Validation: Validate the feedback ID query parameter.
          - Database Interaction: Delete the feedback from the database.
      `,
  path: '/feedback/delete-feedback',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Feedback'],
  responses: {
    200: {
      description: 'Feedback deleted successfully',
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
