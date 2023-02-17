import { FastifyReply, FastifyRequest } from 'fastify';

export const checkSessionIdExistsMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return reply.status(401).send('Unauthorized');
  }
};
