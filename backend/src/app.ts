import Fastify, { FastifyInstance } from "fastify";
import registerRoutes from "./utilities/registerRoutes";
import registerSchemas from "./utilities/registerSchemas";
import registerPlugins from "./utilities/registerPlugins";

// inisialisasi server
export const server: FastifyInstance = Fastify({ logger: true });

// fungsi utama
async function app() {
  try {
    // register schemas
    await registerSchemas("./src/modules", server);

    // register plugins/decorations
    await registerPlugins("./src/plugins", server);

    // register route
    await registerRoutes("./src/modules", server);

    // host server
    const host: string | undefined =
      process.env.HOST === undefined ? "0.0.0.0" : process.env.HOST;

    // port server
    const port: number | undefined =
      process.env.PORT === undefined ? 0 : Number(process.env.PORT);

    // URL server
    const url: string | undefined =
      process.env.URL === undefined ? "" : process.env.URL;

    // listen port
    await server.listen({ port: port, host: host });

    // berikan pesan
    console.log(`Server ready at ${url}:${port}`);
  } catch (e: any) {
    // console pesan error
    console.error(e);

    // hentikan semua proses
    process.exit(1);
  }
}

// jalankan fungsi utama
app();
