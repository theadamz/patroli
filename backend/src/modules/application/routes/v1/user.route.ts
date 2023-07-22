import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createUserHandler,
  deleteUserHandler,
  getUserByIdOrEmailHandler,
  getUsersHandler,
  updateUserHandler,
} from "@modules/application/controllers/user.controller";
import { $ref } from "@modules/application/schemas/user.schema";

export default async function userRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get(
    "/",
    {
      preHandler: [server.joseAuth],
      schema: {
        querystring: $ref("userQueryParametersSchema"),
        response: {
          200: $ref("usersResponseSchema"),
        },
      },
    },
    getUsersHandler
  );

  server.get(
    "/:id",
    {
      preHandler: [server.joseAuth],
      schema: {
        params: $ref("userParamsRequestSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    getUserByIdOrEmailHandler
  );

  server.post(
    "/",
    {
      preHandler: [server.joseAuth, server.csrfGuard],
      schema: {
        body: $ref("userCreateRequestSchema"),
        response: {
          201: $ref("userResponseSchema"),
        },
      },
    },
    createUserHandler
  );

  server.put(
    "/:id",
    {
      preHandler: [server.joseAuth, server.csrfGuard],
      schema: {
        params: $ref("userParamsRequestSchema"),
        body: $ref("userUpdateRequestSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    updateUserHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: [server.joseAuth, server.csrfGuard],
      schema: {
        params: $ref("userParamsRequestSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    deleteUserHandler
  );
}

export const options: FastifyPluginOptions = {
  prefix: "v1/users",
};
