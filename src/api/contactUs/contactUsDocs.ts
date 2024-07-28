import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ContactUsQuery, ContactUsSchema, ContactUsSchemaEdit } from './contactUsSchemas';

export const contactUsRegistry = new OpenAPIRegistry();

// get all contact us

contactUsRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint retrieves all contact us entries:
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch all contact us entries from the database.
  `,
  path: '/contact-us/get-all-contact',
  request: {
    query: ContactUsQuery,
  },
  tags: ['Contact Us'],
  responses: {
    200: {
      description: 'Get all Contact Us',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            contactUs: z.array(ContactUsSchema),
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

// get single contact us

contactUsRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieves a single contact us entry by its ID:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Fetch a contact us entry from the database.
      `,
  path: '/contact-us/get-single-contact',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Contact Us'],
  responses: {
    200: {
      description: 'Contact us entry fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            contactUsEntry: ContactUsSchema,
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
      description: 'Contact us entry not found',
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

// create contact us

contactUsRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new contact us entry:
          - Validation: Validate the request body fields .
          - Database Interaction: Save the new contact us entry to the database.
      `,
  path: '/contact-us/create-contact',
  request: {
    body: {
      description: 'Contact us details',
      content: {
        'application/json': {
          schema: ContactUsSchema,
        },
      },
    },
  },
  tags: ['Contact Us'],
  responses: {
    201: {
      description: 'Contact us entry created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            contactUs: ContactUsSchema,
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

// update contact us

contactUsRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to update an existing contact us entry:
          - Validation: Validate the request body fields .
          - Database Interaction: Update the contact us entry in the database.
      `,
  path: '/contact-us/edit-contact',
  request: {
    query: z.object({ id: z.string() }),

    body: {
      description: 'Contact us details',
      content: {
        'application/json': {
          schema: ContactUsSchemaEdit,
        },
      },
    },
  },
  tags: ['Contact Us'],
  responses: {
    200: {
      description: 'Contact us entry updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            contactUs: ContactUsSchema,
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

// delete contact us

contactUsRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing contact us entry:
          - Validation: Validate the contact ID query parameter.
          - Database Interaction: Delete the contact us entry from the database.
      `,
  path: '/contact-us/delete-contact',
  request: {
    query: z.object({ id: z.string() }),
  },
  tags: ['Contact Us'],
  responses: {
    200: {
      description: 'Contact deleted successfully',
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