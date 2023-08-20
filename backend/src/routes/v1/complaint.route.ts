import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createComplaintHandler,
  getComplaintsHandler,
  getComplaintHandler,
  updateComplaintHandler,
  deleteComplaintHandler,
  getComplaintLogsHandler,
  deleteComplaintImagesHandler,
  deleteComplaintVideosHandler,
  getComplaintPictureFileHandler,
  getComplaintVideoFileHandler,
} from "@root/modules/complaint/controllers/complaint.controller";
import { $ref } from "@root/modules/complaint/schemas/complaint.schema";

const menu_code = "complaint";

export const options: FastifyPluginOptions = {
  prefix: "v1/complaints",
};

export default async function complaintRoutes(
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
        querystring: $ref("complaintQueryParametersSchema"),
        response: {
          200: $ref("complaintsResponseSchema"),
        },
      },
    },
    getComplaintsHandler
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
        params: $ref("complaintParamsRequestSchema"),
        response: {
          200: $ref("complaintResponseSchema"),
        },
      },
    },
    getComplaintHandler
  );

  server.get(
    "/logs/:id",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
      schema: {
        params: $ref("complaintParamsRequestSchema"),
        response: {
          200: $ref("complaintLogsResponseSchema"),
        },
      },
    },
    getComplaintLogsHandler
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
        body: $ref("complaintCreateRequestSchema"),
        response: {
          201: $ref("complaintResponseSchema"),
        },
      },
    },
    createComplaintHandler
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
        consumes: ["multipart/form-data"],
        params: $ref("complaintParamsRequestSchema"),
        body: $ref("complaintUpdateRequestSchema"),
        response: {
          200: $ref("complaintResponseSchema"),
        },
      },
    },
    updateComplaintHandler
  );

  server.delete(
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
        params: $ref("complaintDeleteRequestSchema"),
        response: {
          200: $ref("complaintResponseSchema"),
        },
      },
    },
    deleteComplaintHandler
  );

  server.delete(
    "/:id/pictures",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
        server.csrfGuard,
      ],
      schema: {
        params: $ref("complaintParamsDeletePicturesRequestSchema"),
        body: $ref("complaintDeleteFilesRequestSchema"),
        response: {
          200: $ref("complaintResponseSchema"),
        },
      },
    },
    deleteComplaintImagesHandler
  );

  server.delete(
    "/:id/videos",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
        server.csrfGuard,
      ],
      schema: {
        params: $ref("complaintParamsDeletePicturesRequestSchema"),
        body: $ref("complaintDeleteFilesRequestSchema"),
        response: {
          200: $ref("complaintResponseSchema"),
        },
      },
    },
    deleteComplaintVideosHandler
  );

  server.get(
    "/:id/pictures/:file_name",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
      schema: {
        params: $ref("complaintFileNameParamsRequestSchema"),
      },
    },
    getComplaintPictureFileHandler
  );

  server.get(
    "/:id/videos/:file_name",
    {
      preHandler: [
        server.joseJWTAuth,
        server.accessGuard({
          menuCode: menu_code,
        }),
      ],
      schema: {
        params: $ref("complaintFileNameParamsRequestSchema"),
      },
    },
    getComplaintVideoFileHandler
  );
}
