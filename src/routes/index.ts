import { FastifyInstance } from 'fastify';

import { logRoutes } from './log.routes';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(logRoutes, { prefix: '/log' });
}
