import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { adminRegistry } from '@/api/admin/adminDocs';
// Import your registries
import { authRegistry } from '@/api/auth/authDocs';
import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter';
import { userRegistry } from '@/api/user/userDocs';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, authRegistry, userRegistry, adminRegistry]);

  // Register the security scheme
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'MBNNT Backend API',
    },
    externalDocs: {
      description: 'Find out more about MBNNT Backend API',
      url: '/swagger.json',
    },
  });
}
