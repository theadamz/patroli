import * as jose from "jose";
import { JwtPayload } from "@modules/auth/schemas/auth.schema";
import config from "./config";

const secret = new TextEncoder().encode(process.env.SECRET_KEY);

export const generateRefreshToken = async (payload: JwtPayload) => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS512", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(`urn:${process.env.DOMAIN}:issuer`)
    .setExpirationTime(config.TOKEN_REFRESH_EXPIRE)
    .sign(secret);
};

export const generateAccessToken = async (payload: JwtPayload) => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS512", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(`urn:${process.env.DOMAIN}:issuer`)
    .setExpirationTime(config.TOKEN_ACCESS_EXPIRE)
    .sign(secret);
};

export const verifyToken = async (token: string | null) => {
  try {
    token = token === null ? "" : token;
    const verify = await jose.jwtVerify(token, secret, {
      issuer: `urn:${process.env.DOMAIN}:issuer`,
    });

    return verify;
  } catch (e) {
    return errorHandler(e);
  }
};

export const errorHandler = (error: any) => {
  if (error instanceof jose.errors.JWTExpired) {
    return {
      code: error.code,
      message: "Token expired",
    };
  } else if (error instanceof jose.errors.JWTInvalid) {
    return {
      code: error.code,
      message: "Token invalid",
    };
  } else if (error instanceof jose.errors.JWTClaimValidationFailed) {
    return {
      code: error.code,
      message: "Token claim validation failed",
    };
  } else {
    return error;
  }
};
