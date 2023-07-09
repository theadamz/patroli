import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function routes(server: FastifyInstance) {
  server.get(
    "/healthcheck",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "OK" });
    }
  );
}

export default routes;

export const options = {
  prefix: "v1/basic",
};
