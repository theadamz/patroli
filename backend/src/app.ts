import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import { join } from "path";
import registerSchemas from "./utilities/registerSchemas";
import registerPlugins from "./utilities/registerPlugins";
import registerRoutes from "./utilities/registerRoutes";
import registerHooks from "./utilities/registerHooks";
import {
  createDecorates,
  createMainDecorates,
} from "./utilities/createDecorates";

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
    await registerHooks(app, __dirname);

    // register schemas
    await registerSchemas(join(__dirname, "modules"), app);

    // initialize first decorations
    await createMainDecorates(join(__dirname, "decorates"), app);

    // register plugins
    await registerPlugins(join(__dirname, "plugins"), app);

    // register route
    await registerRoutes(join(__dirname, "routes"), app);

    // initialize last decorate
    await createDecorates(join(__dirname, "decorates"), app);

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
    "@databases": `${__dirname}/databases`,
    "@modules": `${__dirname}/modules`,
    "@utilities": `${__dirname}/utilities`,
    "@contents": `${__dirname}/contents`,
    "@root": `${__dirname}`,
  });
}

// jalankan fungsi utama
main();
