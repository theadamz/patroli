import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createRoleHandler,
  getRoleAccesssHandler,
  getRoleHandler,
  getRolesHandler,
  updateRoleHandler,
} from "@modules/application/controllers/role.controller";
import { $ref } from "@modules/application/schemas/role.schema";

const menu_code = "role";

export const options: FastifyPluginOptions = {
  prefix: "v1/roles",
};

export default async function roleRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get(
    "/",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
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
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
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
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
        server.csrfGuard,
      ],
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
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
        server.csrfGuard,
      ],
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

  /* server.delete(
    "/:id",
    {
      preHandler: [
        server.joseJWTAuth, server.accessGuard({
          menuCode: menu_code,
        }),
        server.csrfGuard,
      ],
      schema: {
        params: $ref("roleParamsRequestSchema"),
        response: {
          200: $ref("roleResponseSchema"),
        },
      },
    },
    deleteRoleHandler
  ); */

  server.get(
    "/accesses/:role_id",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
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
