import { z } from "zod";

const userInfo = z.object({
  id: z.string(),
  public_id: z.string(),
  email: z.string().email(),
  role_id: z.string(),
  role_name: z.string(),
});

const jwtPayload = z.object({
  id: z.string(),
  actor: z.string(),
  actor_id: z.string(),
});

export const platformEnum = z.enum(["web", "mobile_officer", "mobile_citizen"]);

export const fileType = z.object({
  data: z.any(),
  filename: z.string().min(1),
  filenamehash: z.string().nullish(),
  filepath: z.string().nullish(),
  encoding: z.string(),
  mimetype: z.string(),
  limit: z.boolean(),
});

export const fileTypeOptional = z.object({
  data: z.any(),
  filename: z.string(),
  filenamehash: z.string().nullish(),
  filepath: z.string().nullish(),
  encoding: z.string(),
  mimetype: z.string(),
  limit: z.boolean(),
});

export type UserInfo = z.infer<typeof userInfo>;
export type JwtPayload = z.infer<typeof jwtPayload>;
export type PlatformEnum = z.infer<typeof platformEnum>;
export type FileType = z.infer<typeof fileType>;

export const REGEX_CODE: RegExp = /[a-zA-Z0-9-_+=#]$/gi; // a-z, A-Z, 0-9, symbol: -_+=#
export const REGEX_ID_CARD_NUMBER: RegExp = /[0-9-_#]$/gi; // 0-9, symbol: -_#
