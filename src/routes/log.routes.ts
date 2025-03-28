import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { ListActionsQuantityByCampaignUseCase } from '../use-cases/log/list-actions-quantity-by-campaign-use-case';
import { ListLinksByCampaignUseCase } from '../use-cases/log/list-links-by-campaign-use-case';
import { NewLogUseCase } from '../use-cases/log/new-log-use-case';

export async function logRoutes(app: FastifyInstance) {
  app.get('/:id_campanha', async (request, reply) => {
    const paramsSchema = z.object({
      id_campanha: z.coerce.number(),
    });
    const queySchema = z.object({
      date: z.string().date().optional(),
    });

    const { id_campanha } = paramsSchema.parse(request.params);
    const { date } = queySchema.parse(request.query);

    const listActionsQuantityByCampaignUseCase =
      new ListActionsQuantityByCampaignUseCase();
    const result = await listActionsQuantityByCampaignUseCase.execute({
      id_campanha,
      date,
    });

    reply.code(200).send({ data: result });
  });

  app.get('/:id_campanha/links', async (request, reply) => {
    const paramsSchema = z.object({
      id_campanha: z.coerce.number(),
    });
    const { id_campanha } = paramsSchema.parse(request.params);

    const listLinksByCampaignUseCase = new ListLinksByCampaignUseCase();
    const link = await listLinksByCampaignUseCase.execute({
      id_campanha,
    });

    reply.code(200).send({ data: link });
  });

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      id_acao: z.coerce.number(),
      link: z.string().url(),
    });

    const { id_acao, link } = bodySchema.parse(request.body);

    const newLogUseCase = new NewLogUseCase();
    await newLogUseCase.execute({ id_acao, link });

    reply.code(201).send({ message: 'Log inserido com sucesso' });
  });
}
