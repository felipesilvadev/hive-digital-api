import { FastifyInstance } from 'fastify';
import { RowDataPacket } from 'mysql2';
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
      await db.query(
        'INSERT INTO tab_log (id_acao, link) VALUES (?, ?)',
        [id_acao, link]
      );

      const [result] = await db.query<RowDataPacket[]>(
        'SELECT C.nome as campanha, A.descricao as acao, A.ordem FROM tab_campanha_acoes A INNER JOIN tab_campanhas C ON (C.id_campanha = A.id_campanha) WHERE A.id_campanha_acao = (?)',
        [id_acao]
      );

      const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      const emojis = {
        1: '😊',
        2: '😎😎',
        3: '🤑🤑🤑'
      };

      const text = `${result[0]?.ordem}. ${result[0]?.campanha} - ${result[0]?.acao} ${emojis[result[0]?.ordem as 1 | 2 | 3]}`;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      reply.code(201).send({
        message: 'Log inserido com sucesso',
      });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: 'Erro ao inserir log' });
    }
  });
}