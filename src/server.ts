import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

import { env } from './env';

import { globalErrorHandler } from './middlewares/error-handler';

import { registerRoutes } from './routes';

const app = Fastify();
app.register(cors, {
  origin: [
    'http://localhost:5173',
    'https://dados.testenet.com.br',
    'https://testenet.com.br',
    'https://gerandocpf.com.br',
  ],
});
app.register(cookie, {
  secret: env.COOKIE_SECRET,
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },
});
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.setErrorHandler(globalErrorHandler);

registerRoutes(app);

const PORT = Number(process.env.PORT || 3333);
app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server is running at ${address}`);
});
