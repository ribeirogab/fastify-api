import { app } from './app';
import { env } from './configs';

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 Server is running on port ${env.PORT}`);
});
