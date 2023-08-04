import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const options = {
  prefix: "v1/test",
};

async function testRoutes(server: FastifyInstance) {
  server.get(
    "/healthcheck",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ health: "OK" });
    }
  );

  server.get(
    "/protected-route",
    {
      preHandler: [server.joseJWTAuth, server.csrfGuard],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ check: "Protected Route" });
    }
  );

  server.post(
    "/protected-route",
    {
      preHandler: [server.joseJWTAuth, server.csrfGuard],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return request.body;
    }
  );
}

export default testRoutes;
