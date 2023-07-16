import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const roleSchema = {
  id: z.string().nullish(),
  code: z.string(),
  name: z.string(),
  created_by: z.string().nullish(),
  updated_by: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

const roleAccessSchema = {
  id: z.string().nullish(),
  role_id: z.string(),
  role_name: z.string().nullish(),
  menu_id: z.string(),
  menu_name: z.string().nullish(),
  allow_create: z.boolean(),
  allow_edit: z.boolean(),
  allow_delete: z.boolean(),
  created_by: z.string().nullish(),
  updated_by: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects request
const roleQueryParametersSchema = z.object({
  page: z.number().gte(1),
  per_page: z.number().gte(0),
  sort_by: z
    .enum(["code", "name", "id"])
    .optional()
    .nullable()
    .default("id")
    .optional(),
  sort_direction: z.enum(["asc", "desc"]).nullable().default("asc").optional(),
  search: z.string().optional(),
});

const roleAccessParamsParametersSchema = z.object({
  role_id: z.string(),
});

const roleParamsRequestSchema = z.object({
  id: z.string(),
});

const roleCreateRequestSchema = z.object({
  ...roleSchema,
});

const roleUpdateRequestSchema = z.object({
  ...roleSchema,
});

// Objects response
const roleResponseSchema = z.object({
  ...roleSchema,
});

const rolesResponseSchema = z.object({
  data: z.array(roleResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

const roleAccessResponseSchema = z.object({
  ...roleAccessSchema,
});

const roleAccessesResponseSchema = z.array(roleAccessResponseSchema);

// Types request
export type RoleQueryParametersSchema = z.infer<
  typeof roleQueryParametersSchema
>;
export type RoleParamsRequestSchema = z.infer<typeof roleParamsRequestSchema>;
export type RoleCreateRequestSchema = z.infer<typeof roleCreateRequestSchema>;
export type RoleUpdateRequestSchema = z.infer<typeof roleUpdateRequestSchema>;
export type RoleAccessParamsParametersSchema = z.infer<
  typeof roleAccessParamsParametersSchema
>;

// Types response
export type RoleResponseSchema = z.infer<typeof roleResponseSchema>;
export type RolesResponseSchema = z.infer<typeof rolesResponseSchema>;
export type RoleAccessResponseSchema = z.infer<typeof roleAccessResponseSchema>;
export type RoleAccessesResponseSchema = z.infer<
  typeof roleAccessesResponseSchema
>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: roleSchemas, $ref } = buildJsonSchemas(
  {
    roleQueryParametersSchema,
    roleParamsRequestSchema,
    roleCreateRequestSchema,
    roleUpdateRequestSchema,
    roleResponseSchema,
    rolesResponseSchema,
    roleAccessParamsParametersSchema,
    roleAccessResponseSchema,
    roleAccessesResponseSchema,
  },
  { $id: "roleSchemas" }
);
