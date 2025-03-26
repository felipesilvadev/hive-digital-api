import { FastifyInstance } from 'fastify';

import { authenticateRoutes } from './authenticate.routes';
import { profileRoutes } from './profile.routes';
import { logRoutes } from './log.routes';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authenticateRoutes, { prefix: '/auth' });
  await app.register(profileRoutes, { prefix: '/profile' });
  await app.register(logRoutes, { prefix: '/log' });
}
