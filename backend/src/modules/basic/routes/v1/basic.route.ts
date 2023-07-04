import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function routes(server: FastifyInstance) {
  server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: "Hello from basic route 123" });
  });
}

export default routes;

export const options = {
  prefix: "v1/basic",
};
