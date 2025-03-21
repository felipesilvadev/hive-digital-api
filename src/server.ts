import Fastify from 'fastify';
import cors from '@fastify/cors'

import { logRoutes } from './routes/logs';

const app = Fastify();
app.register(cors, {
  origin: 'https://testenet.com.br',
});

app.register(logRoutes);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server is running at ${address}`);
});