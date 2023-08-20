import {
  $ref,
  TemplateParamsRequestSchema,
  UploadsParamsRequestSchema,
} from "@modules/master/schemas/contents.schema";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const options = {
  prefix: "v1/contents",
};

async function contentsRoutes(server: FastifyInstance) {
  server.get(
    "/templates/:template_name",
    {
      preHandler: [server.joseJWTAuth],
      schema: {
        params: $ref("templateParamsRequestSchema"),
      },
    },
    async (
      request: FastifyRequest<{
        Params: TemplateParamsRequestSchema;
      }>,
      reply: FastifyReply
    ) => {
      const templates = {
        test: "test.xlsx",
      };

      const filename = templates[request.params.template_name];

      return reply.sendFile(`templates/${filename}`);
    }
  );

  server.get(
    "/assets/:file_name",
    {
      preHandler: [server.joseJWTAuth],
      schema: {
        params: $ref("uploadsParamsRequestSchema"),
      },
    },
    async (
      request: FastifyRequest<{
        Params: UploadsParamsRequestSchema;
      }>,
      reply: FastifyReply
    ) => {
      return reply.sendFile(`uploads/${request.params.file_name}`);
    }
  );
}

export default contentsRoutes;
