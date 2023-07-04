import { FastifyInstance } from "fastify";
import fs from "fs";

export default async function registerPlugins(
  path: string,
  fastify: FastifyInstance
) {
  const extFile: string = ".ts";
  const suffixFileName: string = "plugin.ts";

  // Ambil folder dari variabel path
  const pluginFiles = fs.readdirSync(path);

  // Baca folder
  pluginFiles.forEach(async (file) => {
    // jika file tidak berakhiran dengan nama plugin.ts maka jalankan lagi fungsi ini lagi
    if (!file.endsWith(suffixFileName)) {
      // Jika file tidak memiliki akhiran .ts
      if (!file.endsWith(extFile)) {
        // Menjalankan fungsi kembali
        await registerPlugins(`${path}/${file}`, fastify);
      }
    } else {
      // import file secara dinamis
      const plugin = require(`../plugins/${path.replace(
        "./src/plugins",
        ""
      )}/${file}`);

      // Jika type tidak undefined
      if (plugin.type !== undefined) {
        // pilih type
        switch (plugin.type) {
          case "custom":
            await plugin.main(fastify); // Jalankan main
            return; // continue
          case "decorate":
            await plugin.main(fastify); // Jalankan main
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
