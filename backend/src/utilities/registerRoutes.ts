import { FastifyInstance } from "fastify";
import fs from "fs";

export default async function registerRoutes(
  path: string,
  fastify: FastifyInstance
) {
  const extFile: string = ".ts";
  const suffixFileName: string = "route.ts";

  // Ambil folder dari variabel path
  const routeFiles = fs.readdirSync(path);

  // Baca folder
  routeFiles.forEach(async (file) => {
    // jika file tidak berakhiran dengan nama route.ts
    if (!file.endsWith(suffixFileName)) {
      // Jika file tidak memiliki akhiran .ts
      if (!file.endsWith(extFile)) {
        // Menjalankan fungsi kembali
        await registerRoutes(`${path}/${file}`, fastify);
      }
    } else {
      // import file secara dinamis
      const route = require(`../modules/${path.replace(
        "./src/modules/",
        ""
      )}/${file}`);

      // Register route
      fastify.register(
        route.default,
        route.options === undefined ? {} : route.options
      );
    }
  });
}
