import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function routes(server: FastifyInstance) {
  server.get(
    "/healthcheck",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ health: "OK" });
    }
  );

  server.get(
    "/protected-route",
    {
      preHandler: [server.JWTAuthenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ check: "Protected Route" });
    }
  );
}

export default routes;

export const options = {
  prefix: "v1/test",
};
