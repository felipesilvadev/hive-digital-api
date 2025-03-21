import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { db } from '../database/db';

export async function logRoutes(app: FastifyInstance) {
  app.get('/log/:id_campanha', async (request, reply) => {
    const paramsSchema = z.object({
      id_campanha: z.coerce.number(),
    });
    const { id_campanha } = paramsSchema.parse(request.params);

    try {
      const [result] = await db.query(
        'SELECT A.descricao, COUNT(L.id_log) as quantidade FROM tab_log L INNER JOIN tab_campanha_acoes A ON (A.id_campanha_acao = L.id_acao) WHERE A.id_campanha = ? GROUP BY L.id_acao ORDER BY A.ordem ASC',
        [id_campanha]
      );

      reply.code(200).send({ data: result });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Erro ao buscar estatísticas da campanha' });
    }
  });

  app.post('/log', async (request, reply) => {
    const bodySchema = z.object({
      id_acao: z.coerce.number(),
      link: z.string().url()
    });

    const { id_acao, link } = bodySchema.parse(request.body);

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