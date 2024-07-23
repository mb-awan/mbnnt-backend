import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

// Import your registries
import {
  authEmaillVerify,
  authGenerateEmailOTP,
  authGeneratePhoneOTP,
  authLogin,
  authRegistry,
  authRequestForgetPasswordOTP,
  authVerifyForgetPasswordOTP,
  authVerifyPhoneOTP,
  authVerifyTwoFactorAuthentication,
  authVerifyUserName,
} from '@/api/auth/authDocs';
import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    authRegistry,
    authLogin,
    authEmaillVerify,
    authGenerateEmailOTP,
    authVerifyPhoneOTP,
    authGeneratePhoneOTP,
    authVerifyUserName,
    authVerifyForgetPasswordOTP,
    authRequestForgetPasswordOTP,
    authVerifyTwoFactorAuthentication,
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  });
}
