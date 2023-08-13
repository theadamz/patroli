import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createCitizenHandler,
  deleteCitizenHandler,
  getCitizenHandler,
  getCitizensHandler,
  updateCitizenHandler,
} from "@modules/master/controllers/citizen.controller";
import { $ref } from "@modules/master/schemas/citizen.schema";

const menu_code = "citizen";

export const options: FastifyPluginOptions = {
  prefix: "v1/citizens",
};

export default async function citizenRoutes(
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
        querystring: $ref("citizenQueryParametersSchema"),
        response: {
          200: $ref("citizensResponseSchema"),
        },
      },
    },
    getCitizensHandler
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
        params: $ref("citizenParamsRequestSchema"),
        response: {
          200: $ref("citizenResponseSchema"),
        },
      },
    },
    getCitizenHandler
  );

  server.post(
    "/registration",
    {
      schema: {
        consumes: ["multipart/form-data"],
        body: $ref("citizenCreateRequestSchema"),
        response: {
          201: $ref("citizenResponseSchema"),
        },
      },
    },
    createCitizenHandler
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
        params: $ref("citizenParamsRequestSchema"),
        body: $ref("citizenUpdateRequestSchema"),
        response: {
          200: $ref("citizenResponseSchema"),
        },
      },
    },
    updateCitizenHandler
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
        params: $ref("citizenParamsRequestSchema"),
        response: {
          200: $ref("citizenResponseSchema"),
        },
      },
    },
    deleteCitizenHandler
  );
}
