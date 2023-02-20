import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '../src/app';

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new transaction', async () => {
    const transaction = { title: 'New transaction', amount: 5000, type: 'credit' };

    const response = await request(app.server)
      .post('/transactions')
      .send(transaction);

    expect(response.statusCode).toBe(200);
    expect(response.body?.transaction?.title).toBe(transaction.title);
  });

  it('should be able to create a new transaction', async () => {
    const transaction = {
      title: 'New transaction',
      type: 'invalid-type',
      amount: 5000,
    };

    const response = await request(app.server)
      .post('/transactions')
      .send(transaction);

    expect(response.statusCode).toBe(200);
    expect(response.body?.transaction?.title).toBe(transaction.title);
  });
});
