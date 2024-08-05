import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { adminRegistry } from '@/api/admin/adminDocs';
// Import your registries
import { authRegistry } from '@/api/auth/authDocs';
import { blogCategoryRegistry } from '@/api/blogCategory/blogCategoryDocs';
import { blogRegistry } from '@/api/blogs/blogsDocs';
import { contactUsRegistry } from '@/api/contactUs/contactUsDocs';
import { faqRegistry } from '@/api/faq/faqDocs';
import { feedbackRegistry } from '@/api/feedback/feedbackDocs';
import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter';
import { newsLetterRegistry } from '@/api/newsLetter/newsLetterDocs';
import { notificationRegistry } from '@/api/notification/notificationDocs';
import { permissionRegistry } from '@/api/permission/permissionDocs';
import { planRegistry } from '@/api/plans/plansDocs';
import { roleRegistry } from '@/api/role/roleDocs';
import { siteInfoRegistry } from '@/api/siteInfo/siteInfoDocs';
import { subscriptionRegistry } from '@/api/subscription/subscriptionDocs';
import { userRegistry } from '@/api/user/userDocs';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    authRegistry,
    userRegistry,
    adminRegistry,
    blogRegistry,
    blogCategoryRegistry,
    contactUsRegistry,
    faqRegistry,
    feedbackRegistry,
    newsLetterRegistry,
    notificationRegistry,
    permissionRegistry,
    roleRegistry,
    planRegistry,
    subscriptionRegistry,
    siteInfoRegistry,
  ]);

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
