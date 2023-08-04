import fs from "fs";
import util from "util";
import { Readable, pipeline } from "stream";
import { ObjectId } from "bson";
import { parse } from "path";

type UploadType = {
  filename: string;
  hashfilename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
};

type FileResponse = {
  result: boolean;
  error?: any;
  data?: UploadType;
};

export const uploadSingleFile = async (
  files: any,
  pathToSave: string | null = null,
  allowedFileExts: string[]
): Promise<FileResponse> => {
  try {
    // check if files not sent
    if (files === undefined || files.length <= 0) {
      return {
        result: false,
        error: "File undefined",
      };
    }

    // get first file
    const data = files[0];

    // if file send but noting attached
    if (data.filename === "") {
      return {
        result: false,
        error: "File not found",
      };
    }

    // get file extension
    const ext = parse(data.filename).ext;
    console.log("ext", ext);

    // check if file are allowed
    if (!allowedFileExts.includes(ext.replace(".", ""))) {
      return {
        result: false,
        error: `File extension not allowed`,
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
      result: true,
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
      result: false,
      error: e,
    };
  }
};

export const deleteFile = async (filePath: string) => {
  return fs.unlinkSync(filePath);
};
