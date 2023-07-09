import { FastifyInstance } from "fastify";
import fs from "fs";
import { join, parse } from "path";

export default async function registerPlugins(
  path: string,
  fastify: FastifyInstance
) {
  // file suffix that will load
  const suffixFileName: string = "plugin";

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
      await registerPlugins(fileWithPath, fastify);
    } else {
      // if check not end with suffixFileName
      if (!check.endsWith(suffixFileName)) return;

      // import file dynamic
      const plugin = require(join(path, file));

      // if type not defined
      if (plugin.type !== undefined) {
        // select plugin type
        switch (plugin.type) {
          case "custom":
            await plugin.main(fastify); // run main function
            return; // continue
          case "decorate":
            await plugin.main(fastify); // run main function
            return; // continue
        }
      }

      // Register plugin
      fastify.register(
        plugin.default,
        plugin.options === undefined ? {} : plugin.options
      );
    }
  });
}
