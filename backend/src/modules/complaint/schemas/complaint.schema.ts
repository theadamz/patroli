import {
  fileType,
  fileTypeOptional,
} from "@modules/application/schemas/commons";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const complaintSchema = {
  id: z.string().nullish(),
  doc_no: z.string().nullish(),
  doc_date: z.date().nullish(),
  complaint_category_id: z.string(),
  complaint_category_name: z.string().nullish(),
  officer_id: z.string().nullish(),
  officer_name: z.string().nullish(),
  description: z.string(),

  video: z
    .object({
      video_filename: z.string(),
      video_filename_hash: z.string(),
    })
    .nullish(),

  pictures: z
    .array(
      z.object({
        picture_filename: z.string(),
        picture_filename_hash: z.string(),
      })
    )
    .nullish(),

  status: z.enum(["menunggu", "proses", "selesai"]).nullish(),
  reason: z.string().nullish(),
  rating: z.number().nullish(),
  created_by: z.string().nullish(),
  updated_by: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects request
const complaintQueryParametersSchema = z.object({
  page: z.number().gte(1),
  per_page: z.number().gte(0),
  sort_by: z
    .enum(["id", "complaint_category_id"])
    .optional()
    .nullable()
    .default("id")
    .optional(),
  sort_direction: z.enum(["asc", "desc"]).nullable().default("asc").optional(),
  search: z.string().optional(),
  is_visible: z.boolean().optional(),
});

const complaintParamsRequestSchema = z.object({
  id: z.string(),
});

const complaintCreateRequestSchema = z.object({
  ...complaintSchema,
  picture_files: z.array(fileType),
  video_file: z.array(fileTypeOptional).nullish(),
  latitude: z.number(),
  longitude: z.number(),
});

const complaintUpdateRequestSchema = z.object({
  ...complaintSchema,
  picture_files: z.array(fileTypeOptional),
  video_file: z.array(fileTypeOptional),
  latitude: z.number(),
  longitude: z.number(),
});

const complaintDeleteRequestSchema = z.object({
  id: z.string(),
});

const complaintParamsDeletePicturesRequestSchema = z.object({
  id: z.string(),
});

const complaintDeleteFilesRequestSchema = z.array(z.string());

const complaintFileNameParamsRequestSchema = z.object({
  id: z.string(),
  file_name: z.string().trim(),
});

// Objects response
const complaintResponseSchema = z.object({
  ...complaintSchema,
  coordinates: z.number().array(),
});

const complaintLogsResponseSchema = z.array(
  z.object({
    message: z.string(),
    old_data: z.string(),
    created_at: z.date(),
  })
);

const complaintsResponseSchema = z.object({
  data: z.array(complaintResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Types request
export type ComplaintQueryParametersSchema = z.infer<
  typeof complaintQueryParametersSchema
>;
export type ComplaintParamsRequestSchema = z.infer<
  typeof complaintParamsRequestSchema
>;
export type ComplaintCreateRequestSchema = z.infer<
  typeof complaintCreateRequestSchema
>;
export type ComplaintUpdateRequestSchema = z.infer<
  typeof complaintUpdateRequestSchema
>;
export type ComplaintDeleteRequestSchema = z.infer<
  typeof complaintDeleteRequestSchema
>;
export type ComplaintParamsDeletePicturesRequestSchema = z.infer<
  typeof complaintParamsDeletePicturesRequestSchema
>;

export type ComplaintDeleteFilesRequestSchema = z.infer<
  typeof complaintDeleteFilesRequestSchema
>;

export type ComplaintFileNameParamsRequestSchema = z.infer<
  typeof complaintFileNameParamsRequestSchema
>;

// Types response
export type ComplaintResponseSchema = z.infer<typeof complaintResponseSchema>;
export type ComplaintsResponseSchema = z.infer<typeof complaintsResponseSchema>;
export type ComplaintLogsResponseSchema = z.infer<
  typeof complaintLogsResponseSchema
>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: complaintSchemas, $ref } = buildJsonSchemas(
  {
    complaintQueryParametersSchema,
    complaintParamsRequestSchema,
    complaintCreateRequestSchema,
    complaintUpdateRequestSchema,
    complaintDeleteRequestSchema,
    complaintParamsDeletePicturesRequestSchema,
    complaintDeleteFilesRequestSchema,
    complaintFileNameParamsRequestSchema,
    complaintResponseSchema,
    complaintsResponseSchema,
    complaintLogsResponseSchema,
  },
  { $id: "complaintSchemas" }
);
