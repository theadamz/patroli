import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const authSchema = {
  email: z
    .string({
      required_error: "email dibutuhkan",
    })
    .email({
      message: "Email tidak valid",
    }),
  password: z.string(),
};

const userInfo = z.object({
  id: z.string(),
});

// Enums
const platformEnum = z.enum(["web", "mobile_officer", "mobile_community"]);

// Objects request
const authLoginRequestSchema = z.object({
  ...authSchema,
});

// Objects response
const authLoginResponseSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role_name: z.string(),
  token: z.string(),
});

// Types enums
export type PlatformEnum = z.infer<typeof platformEnum>;
export type UserInfo = z.infer<typeof userInfo>;

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
