import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createRoleHandler,
  deleteRoleHandler,
  getRoleAccesssHandler,
  getRoleHandler,
  getRolesHandler,
  updateRoleHandler,
} from "@modules/application/controllers/role.controller";
import { $ref } from "@modules/application/schemas/role.schema";

export default async function userRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get(
    "/",
    {
      preHandler: [server.JWTAuthenticate],
      schema: {
        querystring: $ref("roleQueryParametersSchema"),
        response: {
          200: $ref("rolesResponseSchema"),
        },
      },
    },
    getRolesHandler
  );

  server.get(
    "/:id",
    {
      preHandler: [server.JWTAuthenticate],
      schema: {
        params: $ref("roleParamsRequestSchema"),
        response: {
          200: $ref("roleResponseSchema"),
        },
      },
    },
    getRoleHandler
  );

  server.post(
    "/",
    {
      preHandler: [server.JWTAuthenticate],
      schema: {
        body: $ref("roleCreateRequestSchema"),
        response: {
          201: $ref("roleResponseSchema"),
        },
      },
    },
    createRoleHandler
  );

  server.put(
    "/:id",
    {
      preHandler: [server.JWTAuthenticate],
      schema: {
        params: $ref("roleParamsRequestSchema"),
        body: $ref("roleUpdateRequestSchema"),
        response: {
          200: $ref("roleResponseSchema"),
        },
      },
    },
    updateRoleHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: [server.JWTAuthenticate],
      schema: {
        params: $ref("roleParamsRequestSchema"),
        response: {
          200: $ref("roleResponseSchema"),
        },
      },
    },
    deleteRoleHandler
  );

  server.get(
    "/accesses/:role_id",
    {
      preHandler: [server.JWTAuthenticate],
      schema: {
        params: $ref("roleAccessParamsParametersSchema"),
        response: {
          200: $ref("roleAccessesResponseSchema"),
        },
      },
    },
    getRoleAccesssHandler
  );
}

export const options: FastifyPluginOptions = {
  prefix: "v1/roles",
};
