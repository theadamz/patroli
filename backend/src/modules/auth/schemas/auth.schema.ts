import { platformEnum } from "@modules/application/schemas/commons";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

// Base schema
const authSchema = {
  email: z.string().email(),
  password: z.string(),
};

// Objects request
const authLoginRequestSchema = z.object({
  ...authSchema,
  platform: platformEnum,
});

const authRefreshTokenParametersSchema = z.object({
  type: z.enum(["access", "csrf"]),
});

const authLogOutRequestSchema = z.object({
  token: z.string(),
});

const updatePasswordRequestSchema = z.object({
  old_password: z.string().min(6),
  new_password: z.string().min(6),
});

// Objects response
const authLoginResponseSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role_name: z.string(),
  token: z.object({
    refresh: z.string(),
    access: z.string().nullish(),
    csrf: z.string().nullish(),
  }),
  login_time: z.date(),
});

const authRefreshTokenResponseSchema = z.object({
  token: z.string(),
});

const authRefreshTokenResponseNoGeneratedSchema = z.object({
  message: z.string(),
});

const authLogoutResponseSchema = z.object({
  message: z.string(),
  logout_time: z.date(),
});

const profileResponseSchema = z.object({
  identity_no: z.string().nullish(),
  name: z.string(),
  phone_no: z.string().nullish(),
  email: z.string().email(),
  photo_file: z.string().nullish(),
});

const responseSchema = z.object({
  message: z.string(),
});

// Types request
export type AuthLoginRequestSchema = z.infer<typeof authLoginRequestSchema>;
export type AuthRefreshTokenParametersSchema = z.infer<
  typeof authRefreshTokenParametersSchema
>;
export type AuthRefreshTokenResponseNoGeneratedSchema = z.infer<
  typeof authRefreshTokenResponseNoGeneratedSchema
>;
export type AuthLogOutRequestSchema = z.infer<typeof authLogOutRequestSchema>;
export type UpdatePasswordRequestSchema = z.infer<
  typeof updatePasswordRequestSchema
>;

// Types response
export type AuthLoginResponseSchema = z.infer<typeof authLoginResponseSchema>;
export type AuthRefreshTokenResponseSchema = z.infer<
  typeof authRefreshTokenResponseSchema
>;
export type AuthLogoutResponseSchema = z.infer<typeof authLogoutResponseSchema>;
export type ProfileResponseSchema = z.infer<typeof profileResponseSchema>;
export type ResponseSchema = z.infer<typeof responseSchema>;

// List schemas untuk digunakan pada routes (body, query parameter, response, dll)
export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    authLoginRequestSchema,
    authLoginResponseSchema,
    authRefreshTokenParametersSchema,
    authRefreshTokenResponseNoGeneratedSchema,
    authRefreshTokenResponseSchema,
    authLogOutRequestSchema,
    authLogoutResponseSchema,
    profileResponseSchema,
    updatePasswordRequestSchema,
    responseSchema,
  },
  { $id: "authSchemas" }
);
