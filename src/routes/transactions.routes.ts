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

  // List summary
  app.get('/summary', async () => {
    const summary = await database('transactions')
      .sum('amount', { as: 'amount' })
      .first();

    return { summary };
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
  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    const [transaction] = await database('transactions')
      .insert({
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
        id: randomUUID(),
        title,
      })
      .returning('*');

    return { transaction };
  });
};
