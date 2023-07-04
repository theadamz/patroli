import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";

export const type = "decorate";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  // Register
  // await registerPlugin(fastify);
  // fastify.decorate(
  //   "authenticate",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     try {
  //       await request.jwtVerify();
  //     } catch (e: any) {
  //       reply.code(500).send(e);
  //     }
  //   }
  // );
};

async function registerPlugin(fastify: FastifyInstance) {
  const secret = process.env.SECRET_KEY;

  const options: FastifyJWTOptions = {
    secret: secret === undefined ? "" : secret,
    sign: {
      algorithm: "ES256",
    },
  };

  fastify.register(fastifyJwt, options);
}
