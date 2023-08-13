import { FastifyInstance } from "fastify";
import RateLimit from "@fastify/rate-limit";

export const type = "custom";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(RateLimit);
};
