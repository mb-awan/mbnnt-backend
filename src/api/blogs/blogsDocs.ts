import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { apiRoutes } from '@/common/constants/common';

import {
  DeleteBlogValidationSchema,
  UpdateBlogValidationSchema,
  ValidationBlogQuerySchema,
  ValidationBlogSchema,
} from './blogSchemas';
import { blogPaths } from './blogsRoute';
export const blogRegistry = new OpenAPIRegistry();

// get all blog

blogRegistry.registerPath({
  method: 'get',
  description: `
  This endpoint retrieves all blogs:
    - Fetches all blogs from the database.
    - Returns a list of blogs.
`,
  path: `${apiRoutes.blogs}${blogPaths.getAll}`,
  tags: ['Blog'],
  security: [{ bearerAuth: [] }],

  request: {
    query: ValidationBlogQuerySchema,
  },
  responses: {
    200: {
      description: 'Blogs fetched successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            blogs: ValidationBlogQuerySchema,
          }),
        },
      },
    },
    400: {
      description: 'Bad Request ',
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

// get single blog by id

blogRegistry.registerPath({
  method: 'get',
  description: `
        This endpoint retrieve Single blog :
          - Fetches the blog from the database.
          - Returns the blog details.
      `,
  path: `${apiRoutes.blogs}${blogPaths.getSingle}`,
  request: {
    query: z.object({
      id: z.string(),
    }),
  },
  tags: ['Blog'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'Details of the blog  ',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            blog: ValidationBlogSchema,
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
      description: 'Blog   not found',
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

// create new blog

blogRegistry.registerPath({
  method: 'post',
  description: `
        This endpoint allows users to create a new blog :
          - Validation: Validate all fields of the blog .
          - Database Interaction: Save the blog   data to the database.
      `,
  path: `${apiRoutes.blogs}${blogPaths.create}`,
  request: {
    body: {
      description: 'Details of the blog   to be created',
      content: {
        'application/json': {
          schema: ValidationBlogSchema,
        },
      },
    },
  },
  tags: ['Blog'],
  security: [{ bearerAuth: [] }],

  responses: {
    201: {
      description: 'Blog   created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            blog: ValidationBlogSchema,
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

// edit blog

blogRegistry.registerPath({
  method: 'put',
  description: `
        This endpoint allows users to Edit a blog :
          - Validation: Validate all fields are provided.
          - Database Interaction: Save the blog  data to the database.
      `,
  path: `${apiRoutes.blogs}${blogPaths.update}`,
  request: {
    query: z.object({
      id: z.string(),
    }),
    body: {
      description: 'Details of the blog  to be Editted',
      content: {
        'application/json': {
          schema: UpdateBlogValidationSchema,
        },
      },
    },
  },
  tags: ['Blog'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'Blog updated successfully',
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

// delete blog

blogRegistry.registerPath({
  method: 'delete',
  description: `
        This endpoint allows users to delete an existing blog :
          - Validation: Validate blog ID or other identifying information.
          - Database Interaction: Delete the blog   data from the database.
      `,
  path: `${apiRoutes.blogs}${blogPaths.delete}`,
  request: {
    query: z.object({
      id: z.string(),
    }),
  },
  tags: ['Blog'],
  security: [{ bearerAuth: [] }],

  responses: {
    200: {
      description: 'Blog deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            success: z.boolean(),
            blog: DeleteBlogValidationSchema,
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
      description: 'Blog not found',
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
