import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createOfficerHandler,
  deleteOfficerHandler,
  getOfficerHandler,
  getOfficersHandler,
  updateOfficerHandler,
} from "@modules/master/controllers/officer.controller";
import { $ref } from "@modules/master/schemas/officer.schema";

const menu_code = "officer";

export const options: FastifyPluginOptions = {
  prefix: "v1/officers",
};

export default async function officerRoutes(
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
        querystring: $ref("officerQueryParametersSchema"),
        response: {
          200: $ref("officersResponseSchema"),
        },
      },
    },
    getOfficersHandler
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
        params: $ref("officerParamsRequestSchema"),
        response: {
          200: $ref("officerResponseSchema"),
        },
      },
    },
    getOfficerHandler
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
        consumes: ["multipart/form-data"],
        body: $ref("officerCreateRequestSchema"),
        response: {
          201: $ref("officerResponseSchema"),
        },
      },
    },
    createOfficerHandler
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
        params: $ref("officerParamsRequestSchema"),
        body: $ref("officerUpdateRequestSchema"),
        response: {
          200: $ref("officerResponseSchema"),
        },
      },
    },
    updateOfficerHandler
  );

  server.delete(
    "/:id",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
      schema: {
        params: $ref("officerParamsRequestSchema"),
        response: {
          200: $ref("officerResponseSchema"),
        },
      },
    },
    deleteOfficerHandler
  );
}
