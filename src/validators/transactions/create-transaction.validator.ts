import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export type CreateTransactionParsedBody = {
  type: 'credit' | 'debit';
  amount: number;
  title: string;
};

const createTransactionBodySchema = z.object({
  type: z.enum(['credit', 'debit']),
  title: z.string(),
  amount: z.number(),
});

export const createTransactionValidator = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const parsedBody = createTransactionBodySchema.parse(request.body);
    request.body = parsedBody;
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send(error.issues);
    }

    return reply.status(500).send('Server error');
  }
};
