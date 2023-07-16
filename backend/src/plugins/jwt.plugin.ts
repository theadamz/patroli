import FastifyJWT, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserInfo } from "@modules/auth/schemas/auth.schema";
import { envConvert } from "@utilities/envConverts";

// declare
declare module "fastify" {
  export interface FastifyInstance {
    JWTAuthenticate: any;
    request: FastifyRequest;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserInfo;
  }
}

export const type = "decorate";

export const main = async (fastify: FastifyInstance): Promise<void> => {
  // Register
  await registerPlugin(fastify);

  // create decorate
  await fastify.decorate(
    "JWTAuthenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // check .env for check access token
        if (envConvert(process.env.JWT_USE_ACCESS_TOKEN, "bool") === true) {
          // get authorization header
          const authorization = await request.headers.authorization?.split(" ");

          // check if authorization not found
          if (authorization === undefined || authorization === null) {
            return reply.code(401).send({ message: "Access token not found." });
          }

          // check if authorization is not Bearer
          if (authorization[0] !== "Bearer") {
            return reply.code(401).send({ message: "Access token invalid." });
          }

          // verify access token
          await request.jwtVerify();
        }

        // verify refresh token
        await request.jwtVerify({ onlyCookie: true });

        fastify.request = request;
      } catch (e) {
        return reply.code(500).send(e);
      }
    }
  );
};

async function registerPlugin(fastify: FastifyInstance) {
  const options: FastifyJWTOptions = {
    secret: process.env.SECRET_KEY,
    cookie: {
      signed: false,
      cookieName: "_refreshToken",
    },
    sign: {
      expiresIn: process.env.JWT_TOKEN_EXPIRE,
      algorithm: "HS512",
    },
  };

  await fastify.register(FastifyJWT, options);
}
