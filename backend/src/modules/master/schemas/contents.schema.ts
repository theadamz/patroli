import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const templateParamsRequestSchema = z.object({
  template_name: z.enum(["test"]),
});

const uploadsParamsRequestSchema = z.object({
  file_name: z.string().trim(),
});

// Types request
export type TemplateParamsRequestSchema = z.infer<
  typeof templateParamsRequestSchema
>;

export type UploadsParamsRequestSchema = z.infer<
  typeof uploadsParamsRequestSchema
>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: officerSchemas, $ref } = buildJsonSchemas(
  {
    templateParamsRequestSchema,
    uploadsParamsRequestSchema,
  },
  { $id: "contentsSchemas" }
);
