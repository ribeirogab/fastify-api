import { FastifyInstance } from 'fastify';

import { transactionsRoutes } from './transactions.routes';

export const routes = async (app: FastifyInstance) => {
  app.register(transactionsRoutes, { prefix: 'transactions' });
};
