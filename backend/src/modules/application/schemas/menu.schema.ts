import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const menuSchema = {
  id: z.string().nullish(),
  parent_menu_id: z.string().nullish(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  path: z.string().nullable(),
  sort: z.number().gte(1),
  is_active: z.boolean().default(true),
  created_by: z.string().nullish(),
  updated_by: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects type
const menuSchemaType = z.object(menuSchema);
const menuAccessType = z.object({
  menu_id: z.string(),
  menu_code: z.string(),
  menu_name: z.string(),
  allow_create: z.boolean(),
  allow_edit: z.boolean(),
  allow_delete: z.boolean(),
});

// Objects request
const menuQueryParametersSchema = z.object({
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
  is_active: z.boolean().optional(),
});

const menuParamsRequestSchema = z.object({
  id: z.string(),
});

const menuCreateRequestSchema = z.object({
  ...menuSchema,
});

const menuUpdateRequestSchema = z.object({
  ...menuSchema,
});

// Objects response
const menuResponseSchema = z.object({
  ...menuSchema,
});

const menusResponseSchema = z.object({
  data: z.array(menuResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Types
export type MenuSchemaType = z.infer<typeof menuSchemaType>;
export type MenuAccessType = z.infer<typeof menuAccessType>;

// Types request
export type MenuQueryParametersSchema = z.infer<
  typeof menuQueryParametersSchema
>;
export type MenuParamsRequestSchema = z.infer<typeof menuParamsRequestSchema>;
export type MenuCreateRequestSchema = z.infer<typeof menuCreateRequestSchema>;
export type MenuUpdateRequestSchema = z.infer<typeof menuUpdateRequestSchema>;

// Types response
export type MenuResponseSchema = z.infer<typeof menuResponseSchema>;
export type MenusResponseSchema = z.infer<typeof menusResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: menuSchemas, $ref } = buildJsonSchemas(
  {
    menuQueryParametersSchema,
    menuParamsRequestSchema,
    menuCreateRequestSchema,
    menuUpdateRequestSchema,
    menuResponseSchema,
    menusResponseSchema,
  },
  { $id: "menuSchemas" }
);
