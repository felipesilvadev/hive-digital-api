import { FastifyInstance } from 'fastify';

import { db } from '../database/db';

export async function logRoutes(app: FastifyInstance) {
  app.post('/log', async (request, reply) => {
    const { id_acao, link } = request.body as {
      id_acao: number;
      link: string;
    };

    try {
      const [result] = await db.query(
        'INSERT INTO tab_log (id_acao, link) VALUES (?, ?)',
        [id_acao, link]
      );

      reply.code(201).send({
        message: 'Log inserido com sucesso',
      });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Erro ao inserir log' });
    }
  });
}