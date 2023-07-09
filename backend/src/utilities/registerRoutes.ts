import { FastifyInstance } from "fastify";
import fs from "fs";
import { join, parse } from "path";

export default async function registerRoutes(
  path: string,
  fastify: FastifyInstance
) {
  // file suffix that will load
  const suffixFileName: string = "route";

  // get files from path
  const schemaFiles = fs.readdirSync(path);

  // read files
  schemaFiles.forEach(async (file) => {
    // file with path
    const fileWithPath = join(path, file);

    // remove ext
    const ext = parse(file).ext;

    // for check purpose
    const check = fileWithPath.replace(ext, "");

    // if check not end with suffixFileName and ext === "", execute this function again with fileWithPath
    if (!check.endsWith(suffixFileName) && ext === "") {
      await registerRoutes(fileWithPath, fastify);
    } else {
      // if check not end with suffixFileName
      if (!check.endsWith(suffixFileName)) return;

      // import file dynamic
      const route = require(join(path, file));

      // Register route
      fastify.register(
        route.default,
        route.options === undefined ? {} : route.options
      );
    }
  });
}
