import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "@root/utilities/joseHelper";
import config from "@utilities/config";
import { getUserInfoByPublicId } from "@root/utilities/AppHelper";

// declare
declare module "fastify" {
  export interface FastifyInstance {
    joseAuth: any;
  }
}

export const type = "decorate";

export const main = async (fastify: FastifyInstance) => {
  fastify.decorate(
    "joseAuth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // get token from cookie
        // @ts-ignore
        const refreshToken: string =
          request.cookies[config.TOKEN_REFRESH_NAME] === undefined ||
          request.cookies[config.TOKEN_REFRESH_NAME] === null
            ? ""
            : request.cookies[config.TOKEN_REFRESH_NAME];

        // if token is empty
        if (refreshToken === "") {
          return reply.code(400).send({ message: "token not found" });
        }

        // check refresh token
        const verifyRefreshToken: any = await verifyToken(refreshToken);

        // if payload undefined
        if (verifyRefreshToken.payload === undefined) {
          return reply.code(401).send({
            code: verifyRefreshToken.code,
            message: verifyRefreshToken.message,
          });
        }

        // verify access token
        if (
          config.TOKEN_ACCESS &&
          request.raw.url !== "/refresh-token/access"
        ) {
          // get token from cookie
          // @ts-ignore
          const accessToken: string =
            request.cookies[config.TOKEN_ACCESS_NAME] === undefined ||
            request.cookies[config.TOKEN_ACCESS_NAME] === null
              ? ""
              : request.cookies[config.TOKEN_ACCESS_NAME];

          // if token is empty
          if (accessToken === "") {
            return reply.code(400).send({ message: "access token not found" });
          }

          // check access token
          const verifyAccessToken: any = await verifyToken(accessToken);

          // if payload undefined
          if (verifyAccessToken.payload === undefined) {
            return reply.code(401).send({
              code: verifyAccessToken.code,
              message: verifyAccessToken.message,
            });
          }
        }

        // assign auth
        request.auth = {
          id: verifyRefreshToken.payload.id,
          user: await getUserInfoByPublicId(verifyRefreshToken.payload.id),
          payload: verifyRefreshToken.payload,
          token: refreshToken,
        };
      } catch (e) {
        return reply.code(500).send(e);
      }
    }
  );
};
