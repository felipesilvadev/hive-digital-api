import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { AuthenticateUseCase } from '../use-cases/auth/authenticate-use-case';

export async function authenticateRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const authenticateUseCase = new AuthenticateUseCase();
    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: String(user.id),
        },
      },
    );

    reply.setCookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 86400,
    });

    reply.code(200).send();
  });
}
