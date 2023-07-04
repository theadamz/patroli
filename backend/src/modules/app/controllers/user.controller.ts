import { FastifyReply, FastifyRequest } from "fastify";
import {
  UserCreateRequestSchema,
  UserQueryParametersSchema,
  UserParamsRequestSchema,
  UserDeleteRequestSchema,
} from "../schemas/user.schema";
import UserService from "../services/user.service";
import { UserUpdateRequestSchema } from "../schemas/user.schema";
import { z } from "zod";

// Service
const service = new UserService();

export async function listUser(
  request: FastifyRequest<{ Querystring: UserQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get
    const query: UserQueryParametersSchema = request.query;

    // save
    const response = await service.listUsers(query);

    // Send response
    reply.code(response.statusCode).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    reply.code(500).send(e);
  }
}

export async function getUserByIdOrEmail(
  request: FastifyRequest<{ Params: UserParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get parameter
    const parameters = request.params;
    let response;

    // Jika id adalah email
    if (z.string().email().safeParse(parameters.id).success) {
      response = await service.getUserByEmail(parameters.id);
    } else {
      response = await service.getUserById(parameters.id);
    }

    // Send response
    reply.code(response.statusCode).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    reply.code(500).send(e);
  }
}

export async function createUser(
  request: FastifyRequest<{ Body: UserCreateRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // Get input
    const input = request.body;

    // save
    const response = await service.createUser(input);

    // Send response
    reply.code(response.statusCode).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    reply.code(500).send(e);
  }
}

export async function updateUser(
  request: FastifyRequest<{ Body: UserUpdateRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // Get input
    const input = request.body;

    // save
    const response = await service.updateUser(input);

    // Send response
    reply.code(response.statusCode).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    reply.code(500).send(e);
  }
}

export async function deleteUser(
  request: FastifyRequest<{ Body: UserDeleteRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // Get input
    const input = request.body;

    // save
    const response = await service.deleteUser(input.id);

    // Send response
    reply.code(response.statusCode).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    reply.code(500).send(e);
  }
}
