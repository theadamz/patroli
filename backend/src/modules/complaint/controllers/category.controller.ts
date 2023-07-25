import { FastifyReply, FastifyRequest } from "fastify";
import {
  CategoryQueryParametersSchema,
  CategoryParamsRequestSchema,
  CategoryCreateRequestSchema,
  CategoryUpdateRequestSchema,
} from "@root/modules/complaint/schemas/category.schema";
import CategoryRepository from "@root/modules/complaint/repositories/category.repository";

// repository
const repository = new CategoryRepository();

export async function getCategoriesHandler(
  request: FastifyRequest<{ Querystring: CategoryQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get query
    const query = request.query;

    // get data
    const response = await repository.getCategories(query);

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

export async function getCategoryHandler(
  request: FastifyRequest<{ Params: CategoryParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    const response = await repository.getCategoryById(params.id); // get data

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

export async function createCategoryHandler(
  request: FastifyRequest<{ Body: CategoryCreateRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // Get input
    const input = request.body;

    // check if duplicate
    const record = await repository.getCategoryByName(input.name);
    if (record !== null) {
      return reply.conflict("Nama kategori sudah ada");
    }

    // save
    const response = await repository.createCategory(
      input,
      request.auth.user.id
    );

    // Send response
    return reply.code(201).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function updateCategoryHandler(
  request: FastifyRequest<{
    Params: CategoryParamsRequestSchema;
    Body: CategoryUpdateRequestSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    // set input
    const input = request.body;

    // check if data is exist
    const getData = await repository.getCategoryById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if duplicate
    const record = await repository.getCategoryByName(input.name);
    console.log(record);
    if (record !== null && record.id !== params.id) {
      return reply.conflict("Nama kategori sudah ada");
    }

    // save
    const response = await repository.updateCategory(
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
