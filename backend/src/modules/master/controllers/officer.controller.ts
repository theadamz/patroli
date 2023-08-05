import { FastifyReply, FastifyRequest } from "fastify";
import {
  OfficerQueryParametersSchema,
  OfficerParamsRequestSchema,
  OfficerCreateRequestSchema,
  OfficerUpdateRequestSchema,
} from "@modules/master/schemas/officer.schema";
import { ObjectId } from "bson";
import OfficerService from "../services/officer.service";
import UserService from "@modules/application/services/user.service";
import { deleteFile, uploadSingleFile } from "@utilities/fileHandler";
import config from "@utilities/config";

// service
const service = new OfficerService();
const userService = new UserService();

export async function getOfficersHandler(
  request: FastifyRequest<{ Querystring: OfficerQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get query
    const query = request.query;

    // get data
    const response = await service.getOfficers(query);

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

export async function getOfficerHandler(
  request: FastifyRequest<{ Params: OfficerParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // for response
    let response;

    // get params
    const params = request.params;

    // check if object id is valid
    if (ObjectId.isValid(params.id)) {
      response = await service.getOfficerById(params.id); // get data
    } else {
      response = await service.getOfficerByCode(params.id); // get data
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

export async function createOfficerHandler(
  request: FastifyRequest<{ Body: OfficerCreateRequestSchema }>,
  reply: FastifyReply
) {
  let fileuploaded: string = "";

  try {
    // check if not multipart
    if (!request.isMultipart()) {
      return reply.code(400).send(new Error("Request is not multipart"));
    }

    // Get input
    const input = request.body;

    // check if duplicate
    const officer = await service.getOfficerByCode(input.code);
    if (officer !== null && officer.code === input.code) {
      return reply.conflict("Kode sudah digunakan");
    }

    // check if email duplicate
    const officerEmail = await service.getOfficerByEmail(input.email);
    if (officerEmail !== null && officerEmail.email === input.email) {
      return reply.conflict("Email untuk petugas sudah digunakan");
    }

    // check if email duplicate in user
    const userEmailDuplicate = await userService.getUserByEmail(input.email);
    if (
      userEmailDuplicate !== null &&
      userEmailDuplicate.email === input.email
    ) {
      return reply.conflict("Email untuk user sudah digunakan");
    }

    // upload file
    const upload = await uploadSingleFile(
      input.photo_file,
      config.FILE_PATH_UPLOADS,
      ["png", "jpg", "jpeg"]
    );

    // if upload not null
    if (upload.result === "OK") {
      if (upload.data != null) {
        input.photo_filename = upload.data?.filename;
        input.photo_filename_hash = upload.data?.hashfilename;
        fileuploaded = upload.data?.hashfilename;
      }
    } else {
      if (!["FILE_NOT_FOUND", "FILE_UNDEFINED"].includes(upload.result)) {
        return reply.badRequest(upload.error);
      }
    }

    // save
    const response = await service.createOfficer(input, request.auth.user.id);

    // Send response
    return reply.code(201).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // hapus file photo karena error
    if ((e !== null || e !== undefined) && fileuploaded != "") {
      deleteFile(`${config.FILE_PATH_UPLOADS}/${fileuploaded}`);
    }

    // Send response
    return reply.code(500).send(e);
  }
}

export async function updateOfficerHandler(
  request: FastifyRequest<{
    Params: OfficerParamsRequestSchema;
    Body: OfficerUpdateRequestSchema;
  }>,
  reply: FastifyReply
) {
  let fileuploaded: string = "";

  try {
    // check if not multipart
    if (!request.isMultipart()) {
      return reply.code(400).send(new Error("Request is not multipart"));
    }

    // get params
    const params = request.params;

    // set input
    const input = request.body;

    // check if data is exist
    const getData = await service.getOfficerById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if duplicate
    const officer = await service.getOfficerByCode(input.code);
    if (
      officer !== null &&
      officer.code === input.code &&
      officer.id !== params.id
    ) {
      return reply.conflict("Kode sudah digunakan");
    }

    // check if email duplicate
    const officerEmail = await service.getOfficerByEmail(input.email);
    if (
      officerEmail !== null &&
      officerEmail.email === input.email &&
      officerEmail.id !== params.id
    ) {
      return reply.conflict("Email untuk petugas sudah digunakan");
    }

    // check if email duplicate in user
    const userEmailDuplicate = await userService.getUserByEmail(input.email);
    if (
      userEmailDuplicate !== null &&
      userEmailDuplicate.email === input.email &&
      userEmailDuplicate.id !== officerEmail?.user_id
    ) {
      return reply.conflict("Email untuk user sudah digunakan");
    }

    // upload file
    const upload = await uploadSingleFile(
      input.photo_file,
      config.FILE_PATH_UPLOADS,
      ["png", "jpg", "jpeg"]
    );

    // if upload not null
    if (upload.result === "OK") {
      if (upload.data != null) {
        input.photo_filename = upload.data?.filename;
        input.photo_filename_hash = upload.data?.hashfilename;
        fileuploaded = upload.data?.hashfilename;
      }
    } else {
      if (!["FILE_NOT_FOUND", "FILE_UNDEFINED"].includes(upload.result)) {
        return reply.badRequest(upload.error);
      }
    }

    // save
    const response = await service.updateOfficer(
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

export async function deleteOfficerHandler(
  request: FastifyRequest<{ Params: OfficerParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // for response
    let response;

    // get params
    const params = request.params;

    // check if object id is valid
    if (!ObjectId.isValid(params.id)) {
      return reply.badRequest("id tidak valid");
    }

    // jika data tidak ditemukan
    const record = await service.getOfficerById(params.id); // get data
    if (record === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // execute
    response = await service.deleteOfficer(params.id);

    // hapus file
    if (response?.photo_filename_hash !== null) {
      deleteFile(
        `${config.FILE_PATH_UPLOADS}/${response?.photo_filename_hash}`
      );
    }

    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}
