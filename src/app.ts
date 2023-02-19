import cookie from '@fastify/cookie';
import Fastify from 'fastify';

import { routes } from './routes';

const app = Fastify({ logger: false });

app.register(cookie);

app.register(routes);

export { app };
