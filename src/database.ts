import { Knex, knex } from 'knex';

import { env } from './env';

export const config: Knex.Config = {
  client: env.DATABASE_PROVIDER,
  useNullAsDefault: true,
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
};

export const database = knex(config);
