import { FastifyInstance } from "fastify";
import Static, { FastifyStaticOptions } from "@fastify/static";
import config from "@root/config";
import { join } from "path";

export const type = "custom";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(Static, {
    root: join(fastify.rootPath, config.STATIC_PATH_CONTENTS),
    prefix: config.STATIC_PATH_PREFIX_CONTENTS,
  } as FastifyStaticOptions);
};
