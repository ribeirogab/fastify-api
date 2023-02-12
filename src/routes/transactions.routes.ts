import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { database } from '../database';
import { createTransactionBodySchema } from '../schemas/transactions';

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.post('/', async (request) => {
    const { title, amount, type } = createTransactionBodySchema.parse(request.body);

    const [transaction] = await database('transactions')
      .insert({
        amount: type === 'credit' ? amount : amount * -1,
        id: randomUUID(),
        title,
      })
      .returning('*');

    return { transaction };
  });
};
