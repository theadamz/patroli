import { FastifyInstance } from "fastify";
import cors, { FastifyCorsOptions } from "@fastify/cors";
import config from "@root/config";

export const type = "custom";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(cors, {
    origin: (origin: string, cb) => {
      const hostname = new URL(origin).hostname;

      // If in whitelist
      if (config.CORS_WHITELIST.includes(hostname)) {
        // will pass
        cb(null, true);
        return;
      }

      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false);
    },
  } as FastifyCorsOptions);
};
