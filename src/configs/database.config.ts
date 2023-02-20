import { Knex, knex } from 'knex';

import { env } from './env.config';

const connection =
  env.DATABASE_CLIENT === 'sqlite'
    ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  useNullAsDefault: true,
  connection: connection,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
};

export const database = knex(config);
