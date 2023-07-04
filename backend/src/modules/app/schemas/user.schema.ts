import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { ObjectId } from "bson";

// Base schema
const userSchema = {
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  role_id: z.string(),
  created_by: z.string(),
  updated_by: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
};

const userBaseSchema = {
  email: z.string().email(),
  name: z.string().max(150),
};

// Object models
const userModelSchema = z.object({
  ...userSchema,
});

// Objects request
const userCreateRequestSchema = z.object({
  ...userBaseSchema,
  role_id: z.string().transform(function (val, ctx) {
    if (ObjectId.isValid(val)) return val;

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "invalid id",
    });

    return z.NEVER;
  }),
  password: z.string(),
});

const userUpdateRequestSchema = z.object({
  id: z.string(),
  ...userBaseSchema,
  password: z.string().optional(),
  role_id: z.string().transform(function (val, ctx) {
    if (ObjectId.isValid(val)) return val;

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "invalid id",
    });

    return z.NEVER;
  }),
});

const userDeleteRequestSchema = z.object({
  id: z.string(),
});

const userQueryParametersSchema = z.object({
  page: z.number().gte(1),
  per_page: z.number().gte(0),
  sort_by: z
    .enum(["email", "name", "id"])
    .optional()
    .nullable()
    .default("id")
    .optional(),
  sort_direction: z.enum(["asc", "desc"]).nullable().default("asc").optional(),
  search: z.string().optional(),
});

const userParamsRequestSchema = z.object({
  id: z.string(),
});

// Objects response
const userResponseBaseSchema = z.object({
  id: z.string(),
  ...userBaseSchema,
  role_id: z.string().nullish(),
  role_name: z.string().nullish(),
});

const userResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string().optional(),
  data: userResponseBaseSchema.nullish(),
});

const usersResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string().optional(),
  data: z.array(userResponseBaseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Type model
export type UserModelSchema = z.infer<typeof userModelSchema>;

// Types request
export type UserCreateRequestSchema = z.infer<typeof userCreateRequestSchema>;
export type UserUpdateRequestSchema = z.infer<typeof userUpdateRequestSchema>;
export type UserDeleteRequestSchema = z.infer<typeof userDeleteRequestSchema>;
export type UserQueryParametersSchema = z.infer<
  typeof userQueryParametersSchema
>;
export type UserParamsRequestSchema = z.infer<typeof userParamsRequestSchema>;

// Types response
export type UserResponseBaseSchema = z.infer<typeof userResponseBaseSchema>;
export type UserResponseSchema = z.infer<typeof userResponseSchema>;
export type UsersResponseSchema = z.infer<typeof usersResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    userCreateRequestSchema,
    userUpdateRequestSchema,
    userDeleteRequestSchema,
    userResponseSchema,
    usersResponseSchema,
    userParamsRequestSchema,
    userQueryParametersSchema,
  },
  { $id: "userSchemas" }
);
