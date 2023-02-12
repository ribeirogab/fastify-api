import { z } from 'zod';

export const listTransactionParamsSchema = z.object({
  id: z.string(),
});
