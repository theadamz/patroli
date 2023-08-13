import {
  $ref,
  TemplateParamsRequestSchema,
} from "@modules/master/schemas/contents.schema";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const options = {
  prefix: "v1/contents",
};

async function testRoutes(server: FastifyInstance) {
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
}

export default testRoutes;
