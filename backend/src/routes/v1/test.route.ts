import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const options = {
  prefix: "v1/test",
};

async function testRoutes(server: FastifyInstance) {
  server.get(
    "/health-check",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ health: "OK" });
    }
  );

  server.get(
    "/protected-route",
    {
      preHandler: [server.joseJWTAuth, server.csrfGuard],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ check: "Protected Route" });
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

  server.get(
    "/static-check",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.sendFile(`uploads/_blank_photo.png`);
    }
  );
}

export default testRoutes;
