import fs from "fs";
import util from "util";
import { Readable, pipeline } from "stream";
import { ObjectId } from "bson";
import { parse } from "path";
import config from "./config";

type UploadType = {
  filename: string;
  hashfilename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
};

type FileResponse = {
  result:
    | "OK"
    | "FILE_UNDEFINED"
    | "FILE_DATA_UNDEFINED"
    | "FILE_NOT_FOUND"
    | "FILE_EXT_NOT_ALLOWED"
    | "FILE_MIME_TYPE_NOT_ALLOWED"
    | "FILE_SIZE_OVER_LIMIT"
    | "FILE_UPLOAD_ERROR";
  error?: any;
  data?: UploadType;
};

type AllowedFileTypes = {
  jpeg: string;
  jpg: string;
  png: string;
  pdf: string;
  xlsx: string;
  xls: string;
};

export const uploadSingleFile = async (
  files: any,
  pathToSave: string | null = null,
  allowedFileExts: Array<keyof AllowedFileTypes>
): Promise<FileResponse> => {
  try {
    // check if files not sent
    if (files === undefined || files.length <= 0) {
      return {
        result: "FILE_UNDEFINED",
        error: "File undefined",
      };
    }

    // get first file
    const data = files[0];

    // if data.data undefined
    if (data.data === undefined) {
      return {
        result: "FILE_DATA_UNDEFINED",
        error: "File data not acceptable, please check your file ext or size",
      };
    }

    // if file send but noting attached
    if (data.filename === "") {
      return {
        result: "FILE_NOT_FOUND",
        error: "File not found",
      };
    }

    // get file extension
    const ext = parse(data.filename).ext;
    const extOnly = ext.replace(".", "");

    if (!allowedFileExts.includes(extOnly as keyof AllowedFileTypes)) {
      return {
        result: "FILE_EXT_NOT_ALLOWED",
        error: `File extension not allowed`,
      };
    }

    // check mime type
    if (!config.FILE_ALLOWED_MIME_TYPE.includes(data.mimetype)) {
      return {
        result: "FILE_MIME_TYPE_NOT_ALLOWED",
        error: `Mime type not allowed`,
      };
    }

    // get file size
    const size = Buffer.byteLength(data.data);

    // check if file size more than limit
    if (
      size > config.FILE_UPLOAD_MAX_SIZE &&
      config.FILE_UPLOAD_MAX_FILEDS > 0
    ) {
      return {
        result: "FILE_SIZE_OVER_LIMIT",
        error: `File size cannot larger than ${config.FILE_UPLOAD_MAX_FILEDS} bytes`,
      };
    }

    // read data from buffer
    const readFile = Readable.from(data.data);

    // create hash name so it won't conflict with other file
    const hashfilename = `${new ObjectId().toString()}${ext}`;

    // save file
    const storedFile = fs.createWriteStream(`${pathToSave}/${hashfilename}`);
    const pump = util.promisify(pipeline);
    await pump(readFile, storedFile);

    /* 
    {
      data: <Buffer ff d8 ff 75 73 69 ... 68650 more bytes>,
      filename: 'korut.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      limit: false
    } 
    */

    return {
      result: "OK",
      data: {
        filename: data.filename,
        hashfilename: hashfilename,
        encoding: data.encoding,
        mimetype: data.mimetype,
        limit: data.limit,
      },
    };
  } catch (e) {
    return {
      result: "FILE_UPLOAD_ERROR",
      error: e,
    };
  }
};

export const deleteFile = async (filePath: string) => {
  // check jika file exist
  if (fs.existsSync(filePath)) {
    return fs.unlinkSync(filePath);
  }
};
