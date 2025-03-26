import { RowDataPacket } from 'mysql2';
import { compare } from 'bcryptjs';

import { db } from '../../database/db';
import { AppError } from '../../errors/app-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

type QueryResult = RowDataPacket & {
  id_usuario_hive: string;
  senha: string;
};

export class AuthenticateUseCase {
  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const [user] = await db.query<QueryResult[]>(
      /*sql*/ `SELECT id_usuario_hive, senha FROM tab_usuarios_hive WHERE email = ?`,
      [email],
    );

    if (!user.length) {
      throw new AppError('E-mail e/ou senha inválidos');
    }

    const { id_usuario_hive, senha: passwordHash } = user[0];

    const doesPasswordMatches = await compare(password, passwordHash);

    if (!doesPasswordMatches) {
      throw new AppError('E-mail e/ou senha inválidos');
    }

    return {
      user: {
        id: id_usuario_hive,
      },
    };
  }
}
