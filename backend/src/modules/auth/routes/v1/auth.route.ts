import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref } from "@modules/auth/schemas/auth.schema";
import { loginHandler } from "@modules/auth/controllers/auth.controller";

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
