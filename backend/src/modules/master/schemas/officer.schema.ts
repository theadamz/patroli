import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const officerSchema = {
  id: z.string().nullish(),
  code: z.string(),
  name: z.string(),
  phone_no: z.string(),
  email: z.string().email(),
  photo_file: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .nullish(),
  photo_filename: z.string().nullish(),
  photo_filename_hash: z.string().nullish(),
  rating: z.number().nullish(),
  is_active: z.boolean(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects request
const officerQueryParametersSchema = z.object({
  page: z.number().gte(1),
  per_page: z.number().gte(0),
  sort_by: z
    .enum(["code", "name", "id", "email", "phone_no"])
    .optional()
    .nullable()
    .default("id")
    .optional(),
  sort_direction: z.enum(["asc", "desc"]).nullable().default("asc").optional(),
  search: z.string().optional(),
  is_active: z.boolean().optional(),
});

const officerParamsRequestSchema = z.object({
  id: z.string(),
});

const officerCreateRequestSchema = z.object({
  ...officerSchema,
});

const officerUpdateRequestSchema = z.object({
  ...officerSchema,
});

// Objects response
const officerResponseSchema = z.object({
  ...officerSchema,
  user_id: z.string(),
  last_coordinates: z.tuple([z.number(), z.number()]).nullish(),
});

const officersResponseSchema = z.object({
  data: z.array(officerResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Types request
export type OfficerQueryParametersSchema = z.infer<
  typeof officerQueryParametersSchema
>;
export type OfficerParamsRequestSchema = z.infer<
  typeof officerParamsRequestSchema
>;
export type OfficerCreateRequestSchema = z.infer<
  typeof officerCreateRequestSchema
>;
export type OfficerUpdateRequestSchema = z.infer<
  typeof officerUpdateRequestSchema
>;

// Types response
export type OfficerResponseSchema = z.infer<typeof officerResponseSchema>;
export type OfficersResponseSchema = z.infer<typeof officersResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: officerSchemas, $ref } = buildJsonSchemas(
  {
    officerQueryParametersSchema,
    officerParamsRequestSchema,
    officerCreateRequestSchema,
    officerUpdateRequestSchema,
    officerResponseSchema,
    officersResponseSchema,
  },
  { $id: "officerSchemas" }
);
