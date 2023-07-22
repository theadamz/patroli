import crypto from "crypto";
import csrf from "@fastify/csrf";
import prisma from "./prisma";
import { app } from "../app";

const configCsrf = {
  algorithm: "sha1",
  saltLength: 8 * 2,
  secretLength: 18 * 2,
  validity: 0, // 0 = no time
};

const getSecret = async () => {
  return await crypto
    .createHash("SHA1")
    .update(process.env.SECRET_KEY)
    .digest("hex");
};

export const csrfGenerateToken = async () => {
  const secret = await getSecret(); // get secret

  const token = csrf(configCsrf).create(secret); // generate token

  const registeredToken = await registerNewToken(token); // register token

  return registeredToken.token;
};

export const csrfVerifyToken = async (token: string) => {
  try {
    const secret = await getSecret(); // get secret

    const extToken = await getExistingToken(token); // get existing token

    // if token not exist
    if (extToken === null) {
      return false;
    }

    // validate token
    return csrf(configCsrf).verify(secret, token);
  } catch (error) {
    return error;
  }
};

const registerNewToken = async (token: string) => {
  return await prisma.$transaction(async (tx) => {
    // delete token by user
    await tx.user_token.deleteMany({
      where: {
        user_id: app.request.auth.user.id,
      },
    });

    // register new token
    const register = await tx.user_token.create({
      data: {
        token: token,
        user_id: app.request.auth.user.id,
      },
    });

    return register;
  });
};

const getExistingToken = async (token: string) => {
  const existingToken = await prisma.user_token.findFirst({
    where: {
      token: token,
      user_id: app.request.auth.user.id,
    },
  });

  return existingToken;
};
