import fs from "fs";
import util from "util";
import { Readable, pipeline } from "stream";
import { ObjectId } from "bson";
import { parse } from "path";
import config from "./config";
import { FileType } from "@modules/application/schemas/commons";

export enum FileHandlerResult {
  OK = "OK",
  FILE_UNDEFINED = "FILE_UNDEFINED",
  FILE_DATA_UNDEFINED = "FILE_DATA_UNDEFINED",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  FILE_EXT_NOT_ALLOWED = "FILE_EXT_NOT_ALLOWED",
  FILE_MIME_TYPE_NOT_ALLOWED = "FILE_MIME_TYPE_NOT_ALLOWED",
  FILE_SIZE_OVER_LIMIT = "FILE_SIZE_OVER_LIMIT",
  FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",
}

type FileResponse = {
  result: FileHandlerResult;
  error?: any;
  data?: FileType;
};

type FileResponses = {
  result: FileHandlerResult;
  error?: any;
  data?: Array<FileType>;
};

type AllowedFileTypes = {
  jpeg: string;
  jpg: string;
  png: string;
  pdf: string;
  xlsx: string;
  xls: string;
  mp4: string;
};

export const uploadSingleFile = async (
  files: FileType[] | undefined | null,
  allowedFileExts: Array<keyof AllowedFileTypes>,
  pathToSave: string | null = null,
  maxFileSize: number | null = null
): Promise<FileResponse> => {
  try {
    // check if files not sent
    if (!files || files.length <= 0) {
      return {
        result: FileHandlerResult.FILE_UNDEFINED,
        error: "File undefined",
      };
    }

    // get first file
    const file = files[0];

    // if data.data undefined
    if (file.data === undefined) {
      return {
        result: FileHandlerResult.FILE_DATA_UNDEFINED,
        error: "File data not acceptable, please check your file ext or size",
      };
    }

    // if file send but noting attached
    if (file.filename === "") {
      return {
        result: FileHandlerResult.FILE_NOT_FOUND,
        error: "File not found",
      };
    }

    // get file extension
    const ext = parse(file.filename).ext;
    const extOnly = ext.replace(".", "");

    if (!allowedFileExts.includes(extOnly as keyof AllowedFileTypes)) {
      return {
        result: FileHandlerResult.FILE_EXT_NOT_ALLOWED,
        error: `File extension not allowed`,
      };
    }

    // check mime type
    if (!config.FILE_ALLOWED_MIME_TYPE.includes(file.mimetype)) {
      return {
        result: FileHandlerResult.FILE_MIME_TYPE_NOT_ALLOWED,
        error: `Mime type not allowed`,
      };
    }

    // get file size
    const size = Buffer.byteLength(file.data);

    maxFileSize = maxFileSize ?? config.FILE_UPLOAD_MAX_SIZE;

    // check if file size more than limit
    if (size > maxFileSize && config.FILE_UPLOAD_MAX_FIELDS > 0) {
      return {
        result: FileHandlerResult.FILE_SIZE_OVER_LIMIT,
        error: `File size cannot larger than ${config.FILE_UPLOAD_MAX_SIZE} bytes`,
      };
    }

    // read data from buffer
    const readFile = Readable.from(file.data);

    // create hash name so it won't conflict with other file
    const filenamehash = `${new ObjectId().toString()}${ext}`;

    // save file
    const storedFile = fs.createWriteStream(`${pathToSave}/${filenamehash}`);
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
      result: FileHandlerResult.OK,
      data: {
        filename: file.filename,
        filenamehash: filenamehash,
        filepath: `${pathToSave}/${filenamehash}`,
        encoding: file.encoding,
        mimetype: file.mimetype,
        limit: file.limit,
      },
    };
  } catch (e) {
    return {
      result: FileHandlerResult.FILE_UPLOAD_ERROR,
      error: e,
    };
  }
};

export const uploadMultiFile = async (
  files: FileType[] | undefined | null,
  allowedFileExts: Array<keyof AllowedFileTypes>,
  pathToSave: string | null = null,
  maxFileSize: number | null = null
): Promise<FileResponses> => {
  try {
    // check if files not sent
    if (!files || files.length <= 0) {
      return {
        result: FileHandlerResult.FILE_UNDEFINED,
        error: "File undefined",
      };
    }

    // variables
    let savedFiles: FileType[] = [];
    let result: FileHandlerResult = FileHandlerResult.OK;
    let error: string = "No error";

    for await (const file of files) {
      // if data.data undefined
      if (file.data === undefined) {
        result = FileHandlerResult.FILE_DATA_UNDEFINED;
        error = "File data not acceptable, please check your file ext or size";
        break;
      }

      // if file send but noting attached
      if (file.filename === "") {
        result = FileHandlerResult.FILE_NOT_FOUND;
        error = "File not found";
        break;
      }

      // get file extension
      const ext = parse(file.filename).ext;
      const extOnly = ext.replace(".", "");

      if (!allowedFileExts.includes(extOnly as keyof AllowedFileTypes)) {
        result = FileHandlerResult.FILE_EXT_NOT_ALLOWED;
        error = "File extension not allowed";
        break;
      }

      // check mime type
      if (!config.FILE_ALLOWED_MIME_TYPE.includes(file.mimetype)) {
        result = FileHandlerResult.FILE_MIME_TYPE_NOT_ALLOWED;
        error = "Mime type not allowed";
        break;
      }

      // get file size
      const size = Buffer.byteLength(file.data);

      // set maxFileSize
      maxFileSize = maxFileSize ?? config.FILE_UPLOAD_MAX_SIZE;

      // check if file size more than limit
      if (size > maxFileSize && config.FILE_UPLOAD_MAX_FIELDS > 0) {
        result = FileHandlerResult.FILE_SIZE_OVER_LIMIT;
        error =
          "File size cannot larger than ${config.FILE_UPLOAD_MAX_SIZE} bytes";
        break;
      }

      // read data from buffer
      const readFile = Readable.from(file.data);

      // create hash name so it won't conflict with other file
      const filenamehash = `${new ObjectId().toString()}${ext}`;

      // save file
      const storedFile = fs.createWriteStream(`${pathToSave}/${filenamehash}`);
      const pump = util.promisify(pipeline);
      await pump(readFile, storedFile);

      // push file
      savedFiles.push({
        filename: file.filename,
        filenamehash: filenamehash,
        filepath: `${pathToSave}/${filenamehash}`,
        encoding: file.encoding,
        mimetype: file.mimetype,
        limit: file.limit,
      });
    } // ./ for

    // if result not OK
    if (result !== FileHandlerResult.OK) {
      const filesPath = savedFiles.map(
        (file) => `${pathToSave}/${file.filenamehash}`
      ); // get id only
      await deleteMultipleFile(filesPath);
    }

    return {
      result: result,
      data: savedFiles,
      error: error,
    };
  } catch (e) {
    return {
      result: FileHandlerResult.FILE_UPLOAD_ERROR,
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

export const deleteMultipleFile = async (filesPath: Array<string>) => {
  for await (const filePath of filesPath) {
    // check jika file exist
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
