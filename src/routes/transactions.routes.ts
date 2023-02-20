import { randomUUID } from 'node:crypto';

import { FastifyInstance } from 'fastify';

import { database } from '../database';
import { checkSessionIdExistsMiddleware } from '../middlewares';
import {
  CreateTransactionParsedBody,
  createTransactionValidator,
} from '../validators';

export const transactionsRoutes = async (app: FastifyInstance) => {
  // List all
  app.get('/', { preHandler: [checkSessionIdExistsMiddleware] }, async (request) => {
    const { sessionId } = request.cookies;

    const transactions = await database('transactions')
      .select('*')
      .where({ session_id: sessionId });

    return { transactions };
  });

  // List summary
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExistsMiddleware] },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await database('transactions')
        .where({ session_id: sessionId })
        .sum('amount', { as: 'amount' })
        .first();

      return { summary };
    },
  );

  // List by id
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExistsMiddleware] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { sessionId } = request.cookies;

      const transaction = await database('transactions')
        .select('*')
        .where({ id, session_id: sessionId })
        .first();

      if (!transaction) {
        return reply.status(404).send('Transaction not found');
      }

      return { transaction };
    },
  );

  // Create
  app.post(
    '/',
    { preHandler: [createTransactionValidator] },
    async (request, reply) => {
      const { title, amount, type } = request.body as CreateTransactionParsedBody;

      let { sessionId } = request.cookies;

      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie('sessionId', sessionId, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          path: '/',
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
    },
  );
};
