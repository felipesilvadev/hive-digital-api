import { RowDataPacket } from 'mysql2';

import { db } from '../../database/db';
import { AppError } from '../../errors/app-error';

type ListActionsQuantityByCampaignUseCaseRequest = {
  id_campanha: number;
};

type QueryResult = RowDataPacket & {
  descricao: string;
  quantidade: number;
};

export class ListActionsQuantityByCampaignUseCase {
  async execute({ id_campanha }: ListActionsQuantityByCampaignUseCaseRequest) {
    const [rows] = await db.query<QueryResult[]>(
      'SELECT A.descricao, COUNT(L.id_log) as quantidade FROM tab_log L INNER JOIN tab_campanha_acoes A ON (A.id_campanha_acao = L.id_acao) WHERE A.id_campanha = ? GROUP BY L.id_acao ORDER BY A.ordem ASC',
      [id_campanha],
    );

    if (!rows.length) {
      throw new AppError('Campanha não encontrada', 404);
    }

    return rows;
  }
}
