import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const authBaseSchema = {
  email: z
    .string({
      required_error: "email dibutuhkan",
    })
    .email({
      message: "Email tidak valid",
    }),
  password: z.string(),
};

// Objects request
const authLoginRequestSchema = z.object({
  ...authBaseSchema,
});

// Objects response
const authLoginResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string().optional(),
  data: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .nullish(),
});

// Types request
export type AuthLoginRequestSchema = z.infer<typeof authLoginRequestSchema>;

// Types response
export type AuthLoginResponseSchema = z.infer<typeof authLoginResponseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    authLoginRequestSchema,
    authLoginResponseSchema,
  },
  { $id: "authSchemas" }
);
