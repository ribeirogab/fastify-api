import { z } from 'zod';

export const createTransactionBodySchema = z.object({
  type: z.enum(['credit', 'debit']),
  title: z.string(),
  amount: z.number(),
});
