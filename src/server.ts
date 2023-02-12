import Fastify from 'fastify';

import { database } from './database';

const app = Fastify({ logger: false });

app.get('/', async () => {
  const tables = await database('sqlite_schema').select('*');

  return tables;
});

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running...');
});