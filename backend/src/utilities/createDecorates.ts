import { FastifyInstance } from "fastify";
import fs from "fs";
import { join, parse } from "path";

// file suffix that will load
const prefixFileName: string = "_main.decorate";

// file suffix that will load
const suffixFileName: string = "decorate";

export async function createDecorates(path: string, fastify: FastifyInstance) {
  // get files from path
  const files = fs.readdirSync(path);

  // read files
  files.forEach(async (file) => {
    // file with path
    const fileWithPath = join(path, file);

    // remove ext
    const ext = parse(file).ext;

    // for check purpose
    const check = fileWithPath.replace(ext, "");

    // if check not end with suffixFileName and ext === "", execute this function again with fileWithPath
    if (!check.endsWith(suffixFileName) && ext === "") {
      await createDecorates(fileWithPath, fastify);
    } else {
      // if check not end with suffixFileName
      if (file.startsWith(prefixFileName) || !check.endsWith(suffixFileName))
        return;

      // import file dynamic
      const decorate = require(join(path, file));

      if (decorate.type !== undefined) {
        // select plugin type
        switch (decorate.type) {
          case "no-instance":
            await decorate.main(); // run main function
            return; // continue
        }
      }

      await decorate.main(fastify); // run main function
    }
  });
}

export async function createMainDecorates(
  path: string,
  fastify: FastifyInstance
) {
  // get files from path
  const files = fs.readdirSync(path);

  // read files
  files.forEach(async (file) => {
    // if check not end with suffixFileName
    if (!file.startsWith(prefixFileName)) return;

    // import file dynamic
    const decorate = require(join(path, file));

    await decorate.main(fastify); // run main function
  });
}
