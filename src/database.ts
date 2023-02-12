import { knex } from 'knex';

export const database = knex({
  useNullAsDefault: true,
  client: 'sqlite',
  connection: {
    filename: './tmp/data.db',
  },
});
