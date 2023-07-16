import { FastifyReply, FastifyRequest } from "fastify";
import {
  RoleQueryParametersSchema,
  RoleParamsRequestSchema,
  RoleCreateRequestSchema,
  RoleUpdateRequestSchema,
  RoleAccessParamsParametersSchema,
} from "@modules/application/schemas/role.schema";
import RoleService from "@modules/application/services/role.service ";
import { ObjectId } from "bson";

// Service
const service = new RoleService();

export async function getRolesHandler(
  request: FastifyRequest<{ Querystring: RoleQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get query
    const query = request.query;

    // get data
    const response = await service.getRoles(query);

    // if total data <= 0
    if (response.total <= 0) {
      return reply.code(404).send(response);
    } else {
      return reply.code(200).send(response);
    }
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function getRoleHandler(
  request: FastifyRequest<{ Params: RoleParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // for response
    let response;

    // get params
    const params = request.params;

    // check if object id is valid
    if (ObjectId.isValid(params.id)) {
      response = await service.getRoleById(params.id); // get data
    } else {
      response = await service.getRoleByCode(params.id); // get data
    }

    // if data not found
    if (response === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function createRoleHandler(
  request: FastifyRequest<{ Body: RoleCreateRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // Get input
    const input = request.body;

    // check if duplicate
    const role = await service.getRoleByCode(input.code);
    if (role !== null && role.code === input.code) {
      return reply.conflict("Kode sudah digunakan");
    }

    // save
    const response = await service.createRole(input, request.user.id);

    // Send response
    return reply.code(201).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function updateRoleHandler(
  request: FastifyRequest<{
    Params: RoleParamsRequestSchema;
    Body: RoleUpdateRequestSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    // set input
    const input = request.body;

    // check if data is exist
    const getData = await service.getRoleById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if duplicate
    const role = await service.getRoleByCode(input.code);
    if (role !== null && role.code === input.code && role.id !== params.id) {
      return reply.conflict("Kode sudah digunakan");
    }

    // save
    const response = await service.updateRole(
      params.id,
      input,
      request.user.id
    );

    // send response
    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function deleteRoleHandler(
  request: FastifyRequest<{ Params: RoleParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    // check if data is exist
    const getData = await service.getRoleById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // delete
    const response = await service.deleteRole(params.id);

    // send response
    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function getRoleAccesssHandler(
  request: FastifyRequest<{ Params: RoleAccessParamsParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    // get data
    const response = await service.getRoleAccesss(params.role_id);

    // if total data <= 0
    if (response === null) {
      return reply.code(404).send(response);
    } else {
      return reply.code(200).send(response);
    }
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}
