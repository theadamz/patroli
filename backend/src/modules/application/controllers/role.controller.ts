import { FastifyReply, FastifyRequest } from "fastify";
import {
  RoleQueryParametersSchema,
  RoleParamsRequestSchema,
  RoleCreateRequestSchema,
  RoleUpdateRequestSchema,
  RoleAccessParamsParametersSchema,
} from "@modules/application/schemas/role.schema";
import { ObjectId } from "bson";
import RoleRepository from "@modules/application/repositories/role.repository";

// repository
const repository = new RoleRepository();

export async function getRolesHandler(
  request: FastifyRequest<{ Querystring: RoleQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get query
    const query = request.query;

    // get data
    const response = await repository.getRoles(query);

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
      response = await repository.getRoleById(params.id); // get data
    } else {
      response = await repository.getRoleByCode(params.id); // get data
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
    const role = await repository.getRoleByCode(input.code);
    if (role !== null && role.code === input.code) {
      return reply.conflict("Kode sudah digunakan");
    }

    // save
    const response = await repository.createRole(input, request.auth.user.id);

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
    const getData = await repository.getRoleById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if duplicate
    const role = await repository.getRoleByCode(input.code);
    if (role !== null && role.code === input.code && role.id !== params.id) {
      return reply.conflict("Kode sudah digunakan");
    }

    // save
    const response = await repository.updateRole(
      params.id,
      input,
      request.auth.user.id
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
    const getData = await repository.getRoleById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // delete
    const response = await repository.deleteRole(params.id);

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

    // check id
    if (!ObjectId.isValid(params.role_id)) {
      return reply.code(400).send({ message: "Invalid parameter" });
    }

    // get data
    const response = await repository.getRoleAccesss(params.role_id);

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
