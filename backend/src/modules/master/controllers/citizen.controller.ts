import { FastifyReply, FastifyRequest } from "fastify";
import {
  CitizenQueryParametersSchema,
  CitizenParamsRequestSchema,
  CitizenCreateRequestSchema,
  CitizenUpdateRequestSchema,
} from "@modules/master/schemas/citizen.schema";
import { ObjectId } from "bson";
import CitizenService from "../services/citizen.service";
import UserService from "@modules/application/services/user.service";
import { deleteFile, uploadSingleFile } from "@utilities/fileHandler";
import config from "@utilities/config";

// service
const service = new CitizenService();
const userService = new UserService();

export async function getCitizensHandler(
  request: FastifyRequest<{ Querystring: CitizenQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get query
    const query = request.query;

    // get data
    const response = await service.getCitizens(query);

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

export async function getCitizenHandler(
  request: FastifyRequest<{ Params: CitizenParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // for response
    let response;

    // get params
    const params = request.params;

    // check if object id is valid
    if (ObjectId.isValid(params.id)) {
      response = await service.getCitizenById(params.id); // get data
    } else {
      response = await service.getCitizenByCode(params.id); // get data
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

export async function createCitizenHandler(
  request: FastifyRequest<{ Body: CitizenCreateRequestSchema }>,
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

    // check duplicate code / id_card_number
    const citizen = await service.getCitizenByCode(input.id_card_number);
    if (citizen !== null && citizen.id_card_number === input.id_card_number) {
      return reply.conflict("No. KTP sudah teregistrasi.");
    }

    // check duplicate email
    const citizenEmail = await service.getCitizenByEmail(input.email);
    if (citizenEmail !== null && citizenEmail.email === input.email) {
      return reply.conflict("Email untuk petugas sudah digunakan");
    }

    // check duplicate phone_no
    const citizenPhone = await service.getCitizenByPhone(input.email);
    if (citizenPhone !== null && citizenPhone.phone_no === input.phone_no) {
      return reply.conflict("Nomor handphone sudah teregistrasi");
    }

    // check if email already use by other user
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
    const response = await service.createCitizen(input, null);

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

export async function updateCitizenHandler(
  request: FastifyRequest<{
    Params: CitizenParamsRequestSchema;
    Body: CitizenUpdateRequestSchema;
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
    const getData = await service.getCitizenById(params.id);
    if (getData === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check duplicate
    const citizen = await service.getCitizenByCode(input.id_card_number);
    if (
      citizen !== null &&
      citizen.id_card_number === input.id_card_number &&
      citizen.id !== params.id
    ) {
      return reply.conflict("Kode sudah digunakan");
    }

    // check duplicate email
    const citizenEmail = await service.getCitizenByEmail(input.email);
    if (
      citizenEmail !== null &&
      citizenEmail.email === input.email &&
      citizenEmail.id !== params.id
    ) {
      return reply.conflict("Email untuk petugas sudah digunakan");
    }

    // check duplicate phone_no
    const citizenPhone = await service.getCitizenByPhone(input.email);
    if (
      citizenPhone !== null &&
      citizenPhone.phone_no === input.phone_no &&
      citizenPhone.id !== params.id
    ) {
      return reply.conflict("Nomor handphone sudah teregistrasi");
    }

    // check if email already use by other user
    const userEmailDuplicate = await userService.getUserByEmail(input.email);
    if (
      userEmailDuplicate !== null &&
      userEmailDuplicate.email === input.email &&
      userEmailDuplicate.id !== citizenEmail?.user_id
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

      await deleteFile(
        `${config.FILE_PATH_UPLOADS}/${getData.photo_filename_hash}`
      );
    } else {
      if (!["FILE_NOT_FOUND", "FILE_UNDEFINED"].includes(upload.result)) {
        return reply.badRequest(upload.error);
      }
    }

    // save
    const response = await service.updateCitizen(
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

export async function deleteCitizenHandler(
  request: FastifyRequest<{ Params: CitizenParamsRequestSchema }>,
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
    const record = await service.getCitizenById(params.id); // get data
    if (record === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // execute
    response = await service.deleteCitizen(params.id);

    // hapus file
    if (response?.photo_filename_hash !== null) {
      await deleteFile(
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
