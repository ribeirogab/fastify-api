import { Knex, knex } from 'knex';

export const config: Knex.Config = {
  useNullAsDefault: true,
  client: 'sqlite',
  connection: {
    filename: './database/tmp.db',
  },
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
};

export const database = knex(config);
