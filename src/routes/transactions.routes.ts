import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { database } from '../database';
import {
  createTransactionBodySchema,
  listTransactionParamsSchema,
} from '../schemas/transactions';

export const transactionsRoutes = async (app: FastifyInstance) => {
  // List all
  app.get('/', async () => {
    const transactions = await database('transactions').select('*');

    return { transactions };
  });

  // List by id
  app.get('/:id', async (request) => {
    const { id } = listTransactionParamsSchema.parse(request.params);

    const transaction = await database('transactions')
      .select('*')
      .where({ id })
      .first();

    return { transaction };
  });

  // Create
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
