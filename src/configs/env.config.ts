import { config } from 'dotenv';
import { get } from 'env-var';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export const env = {
  NODE_ENV: get('NODE_ENV').required().asEnum(['production', 'development', 'test']),
  STAGE: get('STAGE').required().asEnum(['local', 'dev', 'prod']),
  PORT: get('PORT').default(3333).asPortNumber(),

  DATABASE_CLIENT: get('DATABASE_CLIENT').required().asEnum(['sqlite', 'pg']),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
};
