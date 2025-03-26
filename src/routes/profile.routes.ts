import { FastifyInstance } from 'fastify';

import { verifyJWT } from '../middlewares/verify-jwt';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/me', { onRequest: [verifyJWT] }, async (request, reply) => {
    await request.jwtVerify();

    reply.code(200).send();
  });
}
