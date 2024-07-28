import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { BlogCategory, BlogCategoryQuery } from './blogCategorySchemas';

export const blogCategoryRegistry = new OpenAPIRegistry();

// get all category

blogCategoryRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint allows users to fetch all blog categories:
          - Validation: Validate the query parameters.
          - Database Interaction: Fetch all categories from the database.
      `,
  path: '/category/get-all-category',
  request: {
    query: BlogCategoryQuery,
  },
  tags: ['Blog Category'],
  responses: {
    200: {
      description: 'Categories fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            categories: z.array(BlogCategory),
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

// get single category

blogCategoryRegistry.registerPath({
  method: 'get',
  description: `
    This endpoint allows users to fetch a single blog category by its ID:
      - Validation: Validate the query parameters.
      - Database Interaction: Fetch the category from the database.
  `,
  path: '/category/get-single-category',
  request: {
    query: z.object({
      id: z.string(),
    }),
  },
  tags: ['Blog Category'],
  responses: {
    200: {
      description: 'Category fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            category: BlogCategory,
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
      description: 'Category not found',
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

// create a new category

blogCategoryRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new blog category:
          - Validation: Validate the request body.
          - Database Interaction: Save the new category to the database.
      `,
  path: '/category/create-category',
  request: {
    body: {
      description: 'Category creation details',
      content: {
        'application/json': {
          schema: BlogCategory,
        },
      },
    },
  },
  tags: ['Blog Category'],
  responses: {
    201: {
      description: 'Category created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            category: BlogCategory,
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

// edit category

blogCategoryRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to edit an existing blog category:
          - Validation: Validate the request body.
          - Database Interaction: Update the category in the database.
      `,
  path: '/category/edit-category',
  request: {
    query: z.object({
      id: z.string(),
    }),
    body: {
      description: 'Category update details',
      content: {
        'application/json': {
          schema: BlogCategory,
        },
      },
    },
  },
  tags: ['Blog Category'],
  responses: {
    200: {
      description: 'Category updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            category: BlogCategory,
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
      description: 'Not FOund',
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

// delete category

blogCategoryRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete a blog category:
          - Validation: Validate the query parameters.
          - Database Interaction: Delete the category from the database.
      `,
  path: '/category/delete-category',
  request: {
    query: z.object({
      id: z.string(),
    }),
  },
  tags: ['Blog Category'],
  responses: {
    200: {
      description: 'Category deleted successfully',
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
      description: 'Not FOund',
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