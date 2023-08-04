import { FastifyInstance } from "fastify";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import { version } from "../../package.json";

export const type = "custom";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Patroli API",
        description: "Patroli backend",
        version,
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      withCredentials: true,
      docExpansion: "list",
    },
  });
};
