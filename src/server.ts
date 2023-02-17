import cookie from '@fastify/cookie';
import Fastify from 'fastify';

import { env } from './env';
import { routes } from './routes';

const app = Fastify({ logger: false });

app.register(cookie);

app.register(routes);

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 Server is running on port ${env.PORT}`);
});
