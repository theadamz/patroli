import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const citizenSchema = {
  id: z.string().nullish(),
  id_card_number: z.string(),
  name: z.string(),
  phone_no: z.string(),
  email: z.string().email(),
  photo_file: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .nullish(),
  photo_filename: z.string().nullish(),
  photo_filename_hash: z.string().nullish(),
  is_active: z.boolean().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects request
const citizenQueryParametersSchema = z.object({
  page: z.number().gte(1),
  per_page: z.number().gte(0),
  sort_by: z
    .enum(["id_card_number", "name", "id", "email", "phone_no"])
    .optional()
    .nullable()
    .default("id")
    .optional(),
  sort_direction: z.enum(["asc", "desc"]).nullable().default("asc").optional(),
  search: z.string().optional(),
  is_active: z.boolean().optional(),
});

const citizenParamsRequestSchema = z.object({
  id: z.string(),
});

const citizenCreateRequestSchema = z.object({
  ...citizenSchema,
});

const citizenUpdateRequestSchema = z.object({
  ...citizenSchema,
});

// Objects response
const citizenResponseSchema = z.object({
  ...citizenSchema,
  user_id: z.string(),
  last_coordinates: z.tuple([z.number(), z.number()]).nullish(),
});

const citizensResponseSchema = z.object({
  data: z.array(citizenResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Types request
export type CitizenQueryParametersSchema = z.infer<
  typeof citizenQueryParametersSchema
>;
export type CitizenParamsRequestSchema = z.infer<
  typeof citizenParamsRequestSchema
>;
export type CitizenCreateRequestSchema = z.infer<
  typeof citizenCreateRequestSchema
>;
export type CitizenUpdateRequestSchema = z.infer<
  typeof citizenUpdateRequestSchema
>;

// Types response
export type CitizenResponseSchema = z.infer<typeof citizenResponseSchema>;
export type CitizensResponseSchema = z.infer<typeof citizensResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: citizenSchemas, $ref } = buildJsonSchemas(
  {
    citizenQueryParametersSchema,
    citizenParamsRequestSchema,
    citizenCreateRequestSchema,
    citizenUpdateRequestSchema,
    citizenResponseSchema,
    citizensResponseSchema,
  },
  { $id: "citizenSchemas" }
);
