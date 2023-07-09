import Fastify, { FastifyInstance } from "fastify";
import registerRoutes from "./utilities/registerRoutes";
import registerSchemas from "./utilities/registerSchemas";
import registerPlugins from "./utilities/registerPlugins";
import { join } from "path";
import dotenv from "dotenv";

// load config
dotenv.config();

// inisialisasi server
export const server: FastifyInstance = Fastify({ logger: true });

// fungsi utama
async function main() {
  try {
    // register schemas
    await registerSchemas(join(__dirname, "modules"), server);

    // register plugins/decorations
    await registerPlugins(join(__dirname, "plugins"), server);

    // register route
    await registerRoutes(join(__dirname, "modules"), server);

    // listen port
    await server.listen({ port: process.env.PORT, host: process.env.HOST });

    // berikan pesan
    console.log(`Server ready at ${process.env.URL}:${process.env.PORT}`);
  } catch (e: any) {
    // console pesan error
    console.error(e);

    // hentikan semua proses
    process.exit(1);
  }
}

// jalankan fungsi utama
main();
