import { RowDataPacket } from 'mysql2';

import { db } from '../../database/db';
import { AppError } from '../../errors/app-error';

interface ListActionsQuantityByCampaignUseCaseRequest {
  id_campanha: number;
  date: string | undefined;
}

type QueryResult = RowDataPacket & {
  descricao: string;
  quantidade: number;
};

export class ListActionsQuantityByCampaignUseCase {
  async execute({
    id_campanha,
    date,
  }: ListActionsQuantityByCampaignUseCaseRequest) {
    const filterDate = date ? date : new Date();

    const [rows] = await db.query<QueryResult[]>(
      /*sql*/ `SELECT A.descricao, COUNT(L.id_log) as quantidade FROM tab_log L INNER JOIN tab_campanha_acoes A ON (A.id_campanha_acao = L.id_acao) WHERE A.id_campanha = ? AND A.dt_delete IS NULL AND DATE(L.dt_insert) = DATE(?) GROUP BY L.id_acao ORDER BY A.ordem ASC`,
      [id_campanha, filterDate],
    );

    if (!rows.length) {
      throw new AppError('Campanha não encontrada', 404);
    }

    return rows;
  }
}
