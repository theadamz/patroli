import FastifyMultipart, { FastifyMultipartOptions } from "@fastify/multipart";
import config from "@root/config";

export default FastifyMultipart;

//@ts-ignore
export const options = {
  limits: {
    fieldNameSize: 100,
    fields: 20,
    fileSize: config.FILE_UPLOAD_MAX_SIZE,
    files: config.FILE_UPLOAD_MAX_FIELDS,
  },
  attachFieldsToBody: true,
  addToBody: true,
} as FastifyMultipartOptions;
