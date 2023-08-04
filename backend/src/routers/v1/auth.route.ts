import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import {
  $ref,
  AuthLogOutRequestSchema,
} from "@modules/auth/schemas/auth.schema";
import {
  loginHandler,
  profileHandler,
  refreshTokenHandler,
  updatePasswordHandler,
} from "@modules/auth/controllers/auth.controller";
import config from "@utilities/config";
import { verifyToken } from "@root/utilities/joseJWTAuth";

export const options: FastifyPluginOptions = {
  prefix: "v1",
};

export default async function authRoutes(server: FastifyInstance) {
  server.post(
    "/login",
    {
      schema: {
        body: $ref("authLoginRequestSchema"),
        response: {
          200: $ref("authLoginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get(
    "/refresh-token/:type",
    {
      preHandler: [server.joseJWTAuth],
      schema: {
        params: $ref("authRefreshTokenParametersSchema"),
        response: {
          201: $ref("authRefreshTokenResponseSchema"),
          200: $ref("authRefreshTokenResponseNoGeneratedSchema"),
        },
      },
    },
    refreshTokenHandler
  );

  server.post(
    "/logout",
    {
      preHandler: [server.joseJWTAuth, server.csrfGuard],
      schema: {
        body: $ref("authLogOutRequestSchema"),
        response: {
          200: $ref("authLogoutResponseSchema"),
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: AuthLogOutRequestSchema }>,
      reply: FastifyReply
    ) => {
      // get token
      const token = request.body.token;

      // verify token
      const verify = await verifyToken(token);

      // if payload undefined
      if (verify.payload === undefined) {
        return reply.code(401).send({
          code: verify.code,
          message: verify.message,
        });
      }

      // if token not same
      if (token !== request.auth.token) {
        return reply.code(401).send({
          message: "Token invalid",
        });
      }

      // clear cookie token refresh
      reply.clearCookie(config.TOKEN_REFRESH_NAME);

      // clear cookie token access
      if (config.TOKEN_ACCESS) {
        reply.clearCookie(config.TOKEN_ACCESS_NAME);
      }

      // clear cookie token csrf
      if (config.TOKEN_CSRF) {
        reply.clearCookie(config.TOKEN_CSRF_NAME);
      }

      return reply
        .code(200)
        .send({ message: "Logout success", logout_time: new Date() });
    }
  );

  server.get(
    "/profile",
    {
      preHandler: [server.joseJWTAuth],
      schema: {
        response: {
          200: $ref("profileResponseSchema"),
        },
      },
    },
    profileHandler
  );

  server.put(
    "/change-password",
    {
      preHandler: [server.joseJWTAuth, server.csrfGuard],
      schema: {
        body: $ref("updatePasswordRequestSchema"),
        response: {
          200: $ref("responseSchema"),
        },
      },
    },
    updatePasswordHandler
  );
}
