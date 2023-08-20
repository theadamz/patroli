import { FastifyReply, FastifyRequest } from "fastify";
import {
  ComplaintQueryParametersSchema,
  ComplaintParamsRequestSchema,
  ComplaintCreateRequestSchema,
  ComplaintUpdateRequestSchema,
  ComplaintDeleteRequestSchema,
  ComplaintParamsDeletePicturesRequestSchema,
  ComplaintDeleteFilesRequestSchema,
} from "@modules/complaint/schemas/complaint.schema";
import { ObjectId } from "bson";
import ComplaintService from "../services/complaint.service";
import {
  FileHandlerResult,
  deleteFile,
  deleteMultipleFile,
  uploadMultiFile,
  uploadSingleFile,
} from "@utilities/fileHandler";
import config from "@utilities/config";
import { FileType } from "@modules/application/schemas/commons";
import CategoryRepository from "../repositories/category.repository";
import { ComplaintFileNameParamsRequestSchema } from "../schemas/complaint.schema";

// service
const service = new ComplaintService();

// repository
const categoryComplainRepository = new CategoryRepository();

// variables
let filePicturesUploaded: string[] = [];
let fileVideoPath: string = "";
const videoFileSize: number = 1024 * 1024 * 25; // 25 MB

export async function getComplaintsHandler(
  request: FastifyRequest<{ Querystring: ComplaintQueryParametersSchema }>,
  reply: FastifyReply
) {
  try {
    // get query
    const query = request.query;

    // get data
    const response = await service.getComplaints(
      query,
      request.auth.payload.actor_id
    );

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

export async function getComplaintHandler(
  request: FastifyRequest<{ Params: ComplaintParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    const response = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data

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

export async function getComplaintLogsHandler(
  request: FastifyRequest<{ Params: ComplaintParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    const response = await service.getComplaintLogsById(
      params.id,
      request.auth.payload.actor_id
    ); // get data

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

export async function createComplaintHandler(
  request: FastifyRequest<{ Body: ComplaintCreateRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // check if not multipart
    if (!request.isMultipart()) {
      return reply.code(400).send(new Error("Request is not multipart"));
    }

    // Get input
    const input = request.body;

    // check category complaint exist
    const categoryComplaint = await categoryComplainRepository.getCategoryById(
      input.complaint_category_id
    );
    if (categoryComplaint === null) {
      return reply.badRequest("Category complaint invalid");
    }

    // ============= UPLOAD PICTURES
    // upload file pictures
    const uploadPictures = await uploadMultiFile(
      input.picture_files,
      ["jpeg", "jpg", "png"],
      config.FILE_PATH_UPLOADS
    );

    // if upload picture error
    if (uploadPictures.result !== FileHandlerResult.OK) {
      return reply.badRequest(uploadPictures.error);
    }

    // set initial input pictures
    input.pictures = [];

    // loop uploaded files
    for await (const file of uploadPictures.data as FileType[]) {
      input.pictures.push({
        picture_filename: file.filename,
        picture_filename_hash: file.filenamehash!,
      });

      filePicturesUploaded.push(file.filepath!);
    }

    // ============= UPLOAD VIDEOS
    // set initial input video
    input.video = undefined;

    // upload file video
    const uploadVideo = await uploadSingleFile(
      input.video_file,
      ["mp4"],
      config.FILE_PATH_UPLOADS,
      videoFileSize
    );

    // if upload video not null
    if (uploadVideo.result === FileHandlerResult.OK) {
      input.video = {
        video_filename: uploadVideo.data!.filename,
        video_filename_hash: uploadVideo.data!.filenamehash!,
      };

      fileVideoPath = uploadVideo.data!.filepath!;
    } else {
      if (
        ![
          FileHandlerResult.FILE_NOT_FOUND,
          FileHandlerResult.FILE_UNDEFINED,
        ].includes(uploadVideo.result)
      ) {
        // delete picture files
        if (filePicturesUploaded.length > 0) {
          deleteMultipleFile(filePicturesUploaded);
        }

        return reply.badRequest(uploadVideo.error);
      }
    }

    // save
    const response = await service.createComplaint(
      input,
      request.auth.payload.actor_id,
      request.auth.user.id
    );

    // Send response
    return reply.code(201).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // delete video
    if ((e !== null || e !== undefined) && fileVideoPath !== "") {
      deleteFile(`${fileVideoPath}`);
    }

    // delete pictures
    if ((e !== null || e !== undefined) && filePicturesUploaded.length > 0) {
      deleteMultipleFile(filePicturesUploaded);
    }

    // Send response
    return reply.code(500).send(e);
  }
}

export async function updateComplaintHandler(
  request: FastifyRequest<{
    Params: ComplaintParamsRequestSchema;
    Body: ComplaintUpdateRequestSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // check if not multipart
    if (!request.isMultipart()) {
      return reply.code(400).send(new Error("Request is not multipart"));
    }

    // get params
    const params = request.params;

    // set input
    const input = request.body;

    // check category complaint exist
    const categoryComplaint = await categoryComplainRepository.getCategoryById(
      input.complaint_category_id
    );
    if (categoryComplaint === null) {
      return reply.badRequest("Category complaint invalid");
    }

    // jika data tidak ditemukan
    const record = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data

    if (record === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // ============= UPLOAD PICTURES
    // set input picture
    input.pictures = [];

    // upload file pictures
    const uploadPictures = await uploadMultiFile(
      input.picture_files,
      ["jpeg", "jpg", "png"],
      config.FILE_PATH_UPLOADS
    );

    // if upload picture error
    if (uploadPictures.result === FileHandlerResult.OK) {
      // loop
      for await (const file of uploadPictures.data as FileType[]) {
        input.pictures.push({
          picture_filename: file.filename,
          picture_filename_hash: file.filenamehash!,
        });

        filePicturesUploaded.push(file.filepath!);
      }
    } else {
      if (
        ![
          FileHandlerResult.FILE_NOT_FOUND,
          FileHandlerResult.FILE_UNDEFINED,
        ].includes(uploadPictures.result)
      ) {
        return reply.badRequest(uploadPictures.error);
      }
    }

    // ============= UPLOAD VIDEOS
    // set input picture
    input.video = undefined;

    // upload file video
    const uploadVideo = await uploadSingleFile(
      input.video_file,
      ["mp4"],
      config.FILE_PATH_UPLOADS,
      videoFileSize
    );

    // if upload video not null
    if (uploadVideo.result === FileHandlerResult.OK) {
      input.video = {
        video_filename: uploadVideo.data!.filename,
        video_filename_hash: uploadVideo.data!.filenamehash!,
      };

      fileVideoPath = uploadVideo.data!.filepath!;
    } else {
      if (
        ![
          FileHandlerResult.FILE_NOT_FOUND,
          FileHandlerResult.FILE_UNDEFINED,
        ].includes(uploadVideo.result)
      ) {
        // delete picture files
        if (filePicturesUploaded.length > 0) {
          deleteMultipleFile(filePicturesUploaded);
        }

        return reply.badRequest(uploadVideo.error);
      }
    }

    // save
    const response = await service.updateComplaint(
      params.id,
      input,
      request.auth.payload.actor_id,
      request.auth.user.id
    );

    // if response exist
    if (response !== null) {
      if (uploadVideo.result === FileHandlerResult.OK) {
        // delete previous file video
        deleteFile(
          `${config.FILE_PATH_UPLOADS}/${record.video?.video_filename_hash}`
        );
      }
    }

    // send response
    return reply.code(200).send(response);
  } catch (e: any) {
    // Console log
    console.log(e);

    // delete video
    if ((e !== null || e !== undefined) && fileVideoPath !== "") {
      deleteFile(`${fileVideoPath}`);
    }

    // delete pictures
    if ((e !== null || e !== undefined) && filePicturesUploaded.length > 0) {
      deleteMultipleFile(filePicturesUploaded);
    }

    // Send response
    return reply.code(500).send(e);
  }
}

export async function deleteComplaintHandler(
  request: FastifyRequest<{ Params: ComplaintDeleteRequestSchema }>,
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
    const record = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data
    if (record === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // execute
    response = await service.deleteComplaint(
      params.id,
      request.auth.payload.actor_id
    );

    // hapus file gambar
    if (response?.pictures !== null) {
      // loop
      for await (const file of response!.pictures) {
        await deleteFile(
          `${config.FILE_PATH_UPLOADS}/${file.picture_filename_hash}`
        );
      }
    }

    // hapus file video
    if (response?.video !== null) {
      await deleteFile(
        `${config.FILE_PATH_UPLOADS}/${response?.video.video_filename_hash}`
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

export async function deleteComplaintImagesHandler(
  request: FastifyRequest<{
    Params: ComplaintParamsDeletePicturesRequestSchema;
    Body: ComplaintDeleteFilesRequestSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    // get input
    const input = request.body;

    // check if object id is valid
    if (!ObjectId.isValid(params.id)) {
      return reply.badRequest("id tidak valid");
    }

    // jika data tidak ditemukan
    const record = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data
    if (record === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if picture not found
    if (record.pictures.length <= 0) {
      return reply.notFound("Pictures tidak ditemukan");
    }

    // update pictures
    const response = await service.deleteComplaintPictures(
      params.id,
      input,
      request.auth.payload.actor_id
    );

    // if response not null
    if (response === null) {
      return reply.notFound("File tidak ditemukan");
    } else {
      const filesPath = input.map(
        (file) => `${config.FILE_PATH_UPLOADS}/${file}`
      );
      await deleteMultipleFile(filesPath);

      return reply.code(200).send(response);
    }
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function deleteComplaintVideosHandler(
  request: FastifyRequest<{
    Params: ComplaintParamsDeletePicturesRequestSchema;
    Body: ComplaintDeleteFilesRequestSchema;
  }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    // get input
    const input = request.body;

    // check if object id is valid
    if (!ObjectId.isValid(params.id)) {
      return reply.badRequest("id tidak valid");
    }

    // jika data tidak ditemukan
    const record = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data
    if (record === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if picture not found
    if (!record.video) {
      return reply.notFound("Video tidak ditemukan");
    }

    // update pictures
    const response = await service.deleteComplaintVideos(
      params.id,
      input,
      request.auth.payload.actor_id
    );

    // if response not null
    if (response === null) {
      return reply.notFound("File tidak ditemukan");
    } else {
      const filesPath = input.map(
        (file) => `${config.FILE_PATH_UPLOADS}/${file}`
      );
      await deleteMultipleFile(filesPath);

      return reply.code(200).send(response);
    }
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function getComplaintPictureFileHandler(
  request: FastifyRequest<{ Params: ComplaintFileNameParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    const response = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data

    // if data not found
    if (response === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if file exist in array
    const picture = response.pictures.filter(
      (file) => file.picture_filename_hash === params.file_name
    )[0];
    if (!picture) {
      return reply.notFound("File tidak ditemukan");
    }

    return reply.code(200).sendFile(`uploads/${picture.picture_filename_hash}`);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}

export async function getComplaintVideoFileHandler(
  request: FastifyRequest<{ Params: ComplaintFileNameParamsRequestSchema }>,
  reply: FastifyReply
) {
  try {
    // get params
    const params = request.params;

    const response = await service.getComplaintById(
      params.id,
      request.auth.payload.actor_id
    ); // get data

    // if data not found
    if (response === null) {
      return reply.notFound("Data tidak ditemukan");
    }

    // check if file exist
    if (
      !response.video ||
      response.video.video_filename_hash !== params.file_name
    ) {
      return reply.notFound("File tidak ditemukan");
    }

    return reply
      .code(200)
      .sendFile(`uploads/${response.video.video_filename_hash}`);
  } catch (e: any) {
    // Console log
    console.log(e);

    // Send response
    return reply.code(500).send(e);
  }
}
