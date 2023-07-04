import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  deleteUser,
  listUser,
  getUserByIdOrEmail,
  createUser,
  updateUser,
} from "../../controllers/user.controller";
import { $ref } from "../../schemas/user.schema";

export default async function userRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get(
    "/",
    {
      schema: {
        querystring: $ref("userQueryParametersSchema"),
        response: {
          200: $ref("usersResponseSchema"),
        },
      },
    },
    listUser
  );

  server.get(
    "/:id",
    {
      schema: {
        params: $ref("userParamsRequestSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    getUserByIdOrEmail
  );

  server.post(
    "/",
    {
      schema: {
        body: $ref("userCreateRequestSchema"),
        response: {
          201: $ref("userResponseSchema"),
        },
      },
    },
    createUser
  );

  server.put(
    "/",
    {
      schema: {
        body: $ref("userUpdateRequestSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    updateUser
  );

  server.delete(
    "/",
    {
      schema: {
        body: $ref("userDeleteRequestSchema"),
        response: {
          200: $ref("userResponseSchema"),
        },
      },
    },
    deleteUser
  );
}

export const options: FastifyPluginOptions = {
  prefix: "v1/user",
};
