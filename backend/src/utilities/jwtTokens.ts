import { app } from "@root/app";

export const generateRefreshToken = async (payload: any): Promise<string> => {
  return await app.jwt.sign(payload, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE_REFRESH,
    algorithm: "HS512",
  });
};

export const generateAccessToken = async (payload: any): Promise<string> => {
  return await app.jwt.sign(payload, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE_ACCESS,
    algorithm: "HS512",
  });
};
