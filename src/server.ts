import Fastify from 'fastify';

import { routes } from './routes';

const app = Fastify({ logger: false });

app.register(routes);

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running...');
});
