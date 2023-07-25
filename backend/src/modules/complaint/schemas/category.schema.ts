import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const categorySchema = {
  id: z.string().nullish(),
  name: z.string(),
  is_visible: z.boolean(),
  created_by: z.string().nullish(),
  updated_by: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects request
const categoryQueryParametersSchema = z.object({
  page: z.number().gte(1),
  per_page: z.number().gte(0),
  sort_by: z
    .enum(["id", "name"])
    .optional()
    .nullable()
    .default("id")
    .optional(),
  sort_direction: z.enum(["asc", "desc"]).nullable().default("asc").optional(),
  search: z.string().optional(),
  is_visible: z.boolean().optional(),
});

const categoryParamsRequestSchema = z.object({
  id: z.string(),
});

const categoryCreateRequestSchema = z.object({
  ...categorySchema,
});

const categoryUpdateRequestSchema = z.object({
  ...categorySchema,
});

// Objects response
const categoryResponseSchema = z.object({
  ...categorySchema,
});

const categoriesResponseSchema = z.object({
  data: z.array(categoryResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Types request
export type CategoryQueryParametersSchema = z.infer<
  typeof categoryQueryParametersSchema
>;
export type CategoryParamsRequestSchema = z.infer<
  typeof categoryParamsRequestSchema
>;
export type CategoryCreateRequestSchema = z.infer<
  typeof categoryCreateRequestSchema
>;
export type CategoryUpdateRequestSchema = z.infer<
  typeof categoryUpdateRequestSchema
>;

// Types response
export type CategoryResponseSchema = z.infer<typeof categoryResponseSchema>;
export type CategorysResponseSchema = z.infer<typeof categoriesResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: categorySchemas, $ref } = buildJsonSchemas(
  {
    categoryQueryParametersSchema,
    categoryParamsRequestSchema,
    categoryCreateRequestSchema,
    categoryUpdateRequestSchema,
    categoryResponseSchema,
    categoriesResponseSchema,
  },
  { $id: "categorySchemas" }
);
