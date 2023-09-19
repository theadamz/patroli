import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "@root/utilities/joseJWTAuth";
import config from "@root/config";
import { getUserInfoByPublicId } from "@root/utilities/appHelper";

// declare
declare module "fastify" {
  export interface FastifyInstance {
    joseJWTAuth: any;
  }
}

export const main = async (fastify: FastifyInstance) => {
  fastify.decorate(
    "joseJWTAuth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // get token from cookie
        const refreshToken: string =
          request.cookies[config.TOKEN_REFRESH_NAME] ?? "";

        // if token is empty
        if (refreshToken === "") {
          return reply.code(401).send({ message: "token not found" });
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
          const accessToken: string =
            request.cookies[config.TOKEN_ACCESS_NAME] ?? "";

          // if token is empty
          if (accessToken === "") {
            return reply.code(401).send({ message: "access token not found" });
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

        // get auth information
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
