import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  UserCreateRequestSchema,
  UserParamsRequestSchema,
  UserQueryParametersSchema,
  UserUpdateRequestSchema,
} from "@modules/application/schemas/user.schema";
import UserService from "@modules/application/services/user.service";

// Service
const service = new UserService();

export async function getUsersHandler(
  request: FastifyRequest<{ Querystring: UserQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get
    const query = request.query;

    // save
    const response = await service.getUsers(query);

    // if total data <= 0
    if (response.total <= 0) {
      return reply.code(404).send(response);
    }

    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function getUserByIdOrEmailHandler(
  request: FastifyRequest<{ Params: UserParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // for response
    let response;

    // get parameter
    const parameters = request.params;

    // Jika id adalah email
    if (z.string().email().safeParse(parameters.id).success) {
      response = await service.getUserByEmail(parameters.id);
    } else {
      response = await service.getUserById(parameters.id);
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

export async function createUserHandler(
  request: FastifyRequest<{ Body: UserCreateRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // Get input
    const input = request.body;

    // check if email exist
    const user = await service.getUserByEmail(input.email);
    if (user !== null) {
      return reply.conflict("Email sudah terdaftar");
    }

    // save
    const response = await service.createUser(input);

    // Send response
    return reply.code(201).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function updateUserHandler(
  request: FastifyRequest<{
    Params: UserParamsRequestSchema;
    Body: UserUpdateRequestSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // get parameter
    const parameters = request.params;

    // get input
    const input = request.body;

    // check if data exist
    const user = await service.getUserById(parameters.id);
    if (user === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if email duplicate
    const email = await service.getUserByEmail(input.email);
    if (
      email !== null &&
      email.email === input.email &&
      email.id !== parameters.id
    ) {
      return reply.conflict("Email sudah digunakan");
    }

    // save
    const response = await service.updateUser(
      parameters.id,
      input,
      request.auth.user.id
    );

    // Send response
    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function deleteUserHandler(
  request: FastifyRequest<{ Params: UserParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get parameter
    const parameters = request.params;

    // check if data exist
    const user = await service.getUserById(parameters.id);
    if (user === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // save
    const response = await service.deleteUser(parameters.id);

    // Send response
    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}
