import { execSync } from 'node:child_process';

import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app';

const TRANSACTION = { title: 'New transaction', amount: 5000, type: 'credit' };

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send(TRANSACTION)
      .expect(200);

    expect(response.body?.transaction?.title).toBe(TRANSACTION.title);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(TRANSACTION);

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', createTransactionResponse.get('Set-Cookie'))
      .expect(200);

    expect(response.body?.transactions).toEqual([
      expect.objectContaining({
        title: TRANSACTION.title,
        amount: TRANSACTION.amount,
      }),
    ]);
  });

  it('should be able a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(TRANSACTION);

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    const transactionId = listTransactionsResponse?.body?.transactions[0]?.id;

    const response = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body?.transaction).toEqual(
      expect.objectContaining({
        title: TRANSACTION.title,
        amount: TRANSACTION.amount,
      }),
    );
  });

  it('should be able to list the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(TRANSACTION);

    const cookies = createTransactionResponse.get('Set-Cookie');
    const debitTransactionAmount = 2000;

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({ ...TRANSACTION, type: 'debit', amount: debitTransactionAmount });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', createTransactionResponse.get('Set-Cookie'))
      .expect(200);

    expect(summaryResponse.body?.summary).toEqual({
      amount: TRANSACTION.amount - debitTransactionAmount,
    });
  });

  it('should return 400 if an invalid type is given', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ ...TRANSACTION, type: 'invalid-type' });

    expect(response.statusCode).toBe(400);
  });
});
