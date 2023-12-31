import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  fastify.decorateReply("httpErrors", () => {
    return httpErrors;
  });
};
