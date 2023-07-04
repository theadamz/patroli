import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { ObjectId } from "bson";

// Base schema
const roleBaseSchema = {
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
};

// Objects request
const roleCreateRequestSchema = z.object({
  ...roleBaseSchema,
});

// Objects response
const roleResponseBaseSchema = z.object({
  ...roleBaseSchema,
  id: z.string(),
});

// Types request
export type RoleCreateRequestSchema = z.infer<typeof roleCreateRequestSchema>;

// Types response
export type RoleResponseBaseSchema = z.infer<typeof roleResponseBaseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: roleSchemas, $ref } = buildJsonSchemas(
  {
    roleCreateRequestSchema,
    roleResponseBaseSchema,
  },
  { $id: "roleSchemas" }
);
