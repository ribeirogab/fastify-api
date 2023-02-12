import 'dotenv/config';
import { get } from 'env-var';

const nodeEnvs = ['production', 'development'] as const;
const stages = ['local', 'dev', 'prod'] as const;

export const env = {
  NODE_ENV: get('NODE_ENV').required().asEnum(nodeEnvs),
  STAGE: get('STAGE').required().asEnum(stages),

  DATABASE_PROVIDER: get('DATABASE_PROVIDER').required().asString(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
};
