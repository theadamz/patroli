import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import { join } from "path";
import registerSchemas from "./utilities/registerSchemas";
import registerPlugins from "./utilities/registerPlugins";
import registerRoutes from "./utilities/registerRoutes";
import registerHooks from "./utilities/registerHooks";

// load config
dotenv.config();

// inisialisasi server
export const app: FastifyInstance = Fastify({ logger: true });

// fungsi utama
async function main() {
  try {
    // register aliases
    await registerAliases();

    // register hooks
    await registerHooks(app);

    // register schemas
    await registerSchemas(join(__dirname, "modules"), app);

    // register route
    await registerRoutes(join(__dirname, "modules"), app);

    // register plugins/decorations
    await registerPlugins(join(__dirname, "plugins"), app);

    // listen port
    await app.listen({ port: process.env.PORT, host: process.env.HOST });

    // berikan pesan
    console.log(`Server ready at ${process.env.URL}:${process.env.PORT}`);
  } catch (e: any) {
    // console pesan error
    console.error(e);

    // hentikan semua proses
    process.exit(1);
  }
}

async function registerAliases() {
  const moduleAlias = require("module-alias");

  moduleAlias.addAliases({
    "@root": `${__dirname}`,
    "@databases": `${__dirname}/databases`,
    "@modules": `${__dirname}/modules`,
    "@utilities": `${__dirname}/utilities`,
  });
}

// jalankan fungsi utama
main();
