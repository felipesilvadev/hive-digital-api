import { RowDataPacket } from 'mysql2';

import { env } from '../../env';
import { db } from '../../database/db';
import { AppError } from '../../errors/app-error';

interface NewLogUseCaseRequest {
  id_acao: number;
  link: string;
}

type QueryResult = RowDataPacket & {
  campanha: string;
  acao: string;
  ordem: 1 | 2 | 3 | 4;
};

export class NewLogUseCase {
  async execute({ id_acao, link }: NewLogUseCaseRequest) {
    await db.query(
      /*sql*/ `INSERT INTO tab_log (id_acao, link) VALUES (?, ?)`,
      [id_acao, link],
    );

    const [rows] = await db.query<QueryResult[]>(
      /*sql*/ `SELECT C.nome as campanha, A.descricao as acao, A.ordem FROM tab_campanha_acoes A INNER JOIN tab_campanhas C ON (C.id_campanha = A.id_campanha) WHERE A.id_campanha_acao = (?)`,
      [id_acao],
    );

    if (!rows.length) {
      throw new AppError('Ação não encontrada', 404);
    }

    const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = env;
    const emojis = {
      1: '😊',
      2: '😎😎',
      3: '🤑🤑🤑',
      4: '👏🏻',
    };

    const text = `${rows[0].ordem}. ${rows[0].campanha} - ${rows[0].acao} ${emojis[rows[0].ordem]}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  }
}
