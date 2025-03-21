import { RowDataPacket } from 'mysql2';

import { db } from '../../database/db';
import { AppError } from '../../errors/app-error';

type ListLinksByCampaignUseCaseRequest = {
  id_campanha: number;
};

type QueryResult = RowDataPacket & {
  link: string;
};

export class ListLinksByCampaignUseCase {
  async execute({ id_campanha }: ListLinksByCampaignUseCaseRequest) {
    const [rows] = await db.query<QueryResult[]>(
      'SELECT link FROM tab_campanha_redirect WHERE id_campanha = ? AND dt_delete IS NULL ORDER BY RAND() LIMIT 1',
      [id_campanha],
    );

    if (!rows.length) {
      throw new AppError('Campanha não encontrada', 404);
    }

    return rows[0].link;
  }
}
