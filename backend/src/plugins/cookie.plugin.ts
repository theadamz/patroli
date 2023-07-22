import { FastifyInstance } from "fastify";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

export const type = "custom";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(cookie, {
    secret: process.env.JWT_SECRET_KEY,
    parseOptions: {
      domain: process.env.DOMAIN,
      path: "/",
      httpOnly: true,
    },
    hook: "onRequest",
  } as FastifyCookieOptions);
};
