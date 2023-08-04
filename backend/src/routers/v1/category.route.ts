import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "@root/modules/complaint/controllers/category.controller";
import { $ref } from "@root/modules/complaint/schemas/category.schema";

const menu_code = "complaint-category";

export const options: FastifyPluginOptions = {
  prefix: "v1/complaints/categories",
};

export default async function categoryRoutes(
  server: FastifyInstance
): Promise<void> {
  server.get(
    "/",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({ menuCode: menu_code }),
      ],
      schema: {
        querystring: $ref("categoryQueryParametersSchema"),
        response: {
          200: $ref("categoriesResponseSchema"),
        },
      },
    },
    getCategoriesHandler
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
        params: $ref("categoryParamsRequestSchema"),
        response: {
          200: $ref("categoryResponseSchema"),
        },
      },
    },
    getCategoryHandler
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
        body: $ref("categoryCreateRequestSchema"),
        response: {
          201: $ref("categoryResponseSchema"),
        },
      },
    },
    createCategoryHandler
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
        params: $ref("categoryParamsRequestSchema"),
        body: $ref("categoryUpdateRequestSchema"),
        response: {
          200: $ref("categoryResponseSchema"),
        },
      },
    },
    updateCategoryHandler
  );
}
