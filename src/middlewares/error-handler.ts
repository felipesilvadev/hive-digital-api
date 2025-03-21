import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export function globalErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[ERROR] ${request.method} ${request.url}`);
  console.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      statusCode: error.statusCode,
      ...(isDev && { stack: error.stack }),
    });
  }

  const statusCode = error.statusCode ?? 500;

  return reply.status(statusCode).send({
    message: error.message || 'Erro interno no servidor',
    statusCode,
    ...(isDev && { stack: error.stack }),
  });
}