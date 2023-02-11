import Fastify from 'fastify';

const app = Fastify({ logger: false });

app.get('/', () => {
  return 'Hello Fastify';
});

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running...');
});
