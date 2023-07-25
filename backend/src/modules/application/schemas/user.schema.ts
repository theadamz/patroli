import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import { ObjectId } from "bson";

// Base schema
const userSchema = {
  id: z.string().nullish(),
  public_id: z.boolean().nullish(),
  email: z.string().email(),
  password: z.string().nullish(),
  name: z.string(),
  role_id: z.string().nullish(),
  role_name: z.string().nullish(),
  actor: z.enum(["operator", "officer", "citizen"]),
  is_active: z.boolean().nullish(),
  created_by: z.string().nullish(),
  updated_by: z.string().nullish(),
  created_at: z.date().nullish(),
  updated_at: z.date().nullish(),
};

// Objects request
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
  is_active: z.boolean().optional(),
});

const userParamsRequestSchema = z.object({
  id: z.string(),
});

const userCreateRequestSchema = z.object({
  ...userSchema,
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
  ...userSchema,
  password: z.string().optional(),
  role_id: z
    .string()
    .transform(function (val, ctx) {
      if (ObjectId.isValid(val)) return val;

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalid id",
      });

      return z.NEVER;
    })
    .optional(),
  is_active: z.boolean(),
});

const userDeleteRequestSchema = z.object({
  id: z.string(),
});

// Objects response
const userResponseSchema = z.object({
  ...userSchema,
  id: z.string(),
  role_id: z.string().nullish(),
  role_name: z.string().nullish(),
  public_id: z.string(),
});

const usersResponseSchema = z.object({
  data: z.array(userResponseSchema).nullish(),
  total: z.number().optional(),
  per_page: z.number().optional(),
  current_page: z.number().optional(),
  last_page: z.number().optional(),
});

// Types request
export type UserQueryParametersSchema = z.infer<
  typeof userQueryParametersSchema
>;
export type UserParamsRequestSchema = z.infer<typeof userParamsRequestSchema>;
export type UserCreateRequestSchema = z.infer<typeof userCreateRequestSchema>;
export type UserUpdateRequestSchema = z.infer<typeof userUpdateRequestSchema>;
export type UserDeleteRequestSchema = z.infer<typeof userDeleteRequestSchema>;

// Types response
export type UserResponseSchema = z.infer<typeof userResponseSchema>;
export type UsersResponseSchema = z.infer<typeof usersResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    userQueryParametersSchema,
    userParamsRequestSchema,
    userCreateRequestSchema,
    userUpdateRequestSchema,
    userDeleteRequestSchema,
    userResponseSchema,
    usersResponseSchema,
  },
  { $id: "userSchemas" }
);
