import { FastifyInstance } from "fastify";
import dotenv from "dotenv";

export const type = "decorate";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  fastify.decorate("env", dotenv.config().parsed);
};
