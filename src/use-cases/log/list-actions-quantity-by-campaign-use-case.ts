import { RowDataPacket } from 'mysql2';

import { db } from '../../database/db';

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filterDate = date
      ? new Date(date).toISOString().split('T')[0]
      : today.toISOString().split('T')[0];

    const [rows] = await db.query<QueryResult[]>(
      /*sql*/ `SELECT A.descricao, COUNT(L.id_log) as quantidade FROM tab_log L INNER JOIN tab_campanha_acoes A ON (A.id_campanha_acao = L.id_acao) WHERE A.id_campanha = ? AND A.dt_delete IS NULL AND DATE(L.dt_insert) = ? GROUP BY L.id_acao ORDER BY A.ordem ASC`,
      [id_campanha, filterDate],
    );

    return rows;
  }
}
