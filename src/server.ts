import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';

import { globalErrorHandler } from './middlewares/error-handler';

import { registerRoutes } from './routes';

const app = Fastify();
app.register(cors, {
  origin: ['https://testenet.com.br', 'https://gerandocpf.com.br'],
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
