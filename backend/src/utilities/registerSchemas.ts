import { FastifyInstance } from "fastify";
import fs from "fs";

export default async function registerSchemas(
  path: string,
  fastify: FastifyInstance
) {
  const extFile: string = ".ts";
  const suffixFileName: string = "schema.ts";

  // Ambil folder dari variabel path
  const schemaFiles = fs.readdirSync(path);

  // Baca folder
  schemaFiles.forEach(async (file) => {
    // jika file tidak berakhiran dengan nama schema.ts
    if (!file.endsWith(suffixFileName)) {
      // Jika file tidak memiliki akhiran .ts
      if (!file.endsWith(extFile)) {
        // Menjalankan fungsi kembali
        await registerSchemas(`${path}/${file}`, fastify);
      }
    } else {
      // import file secara dinamis
      const schema = require(`../modules/${path.replace(
        "./src/modules/",
        ""
      )}/${file}`);

      const objectSchema: any = Object.values(schema)[0];

      // @ts-ignore
      fastify.addSchema(objectSchema[0]);
    }
  });
}
