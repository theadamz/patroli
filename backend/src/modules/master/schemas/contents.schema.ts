import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const templateParamsRequestSchema = z.object({
  template_name: z.enum(["test"]),
});

// Types request
export type TemplateParamsRequestSchema = z.infer<
  typeof templateParamsRequestSchema
>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: officerSchemas, $ref } = buildJsonSchemas(
  {
    templateParamsRequestSchema,
  },
  { $id: "contentsSchemas" }
);
