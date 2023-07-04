import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref } from "../../schemas/auth.schema";
import { loginHandler } from "../../controllers/auth.controller";

export default async function authRoutes(server: FastifyInstance) {
  server.post(
    "/login",
    {
      schema: {
        body: $ref("authLoginRequestSchema"),
        response: {
          200: $ref("authLoginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.post(
    "/logout",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "Logout" });
    }
  );
}
