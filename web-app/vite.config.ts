import { UserConfig, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

type ParsedEnv = Record<string, boolean | number | string>;

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  // ambil data .env dengan prefix VITE_
  const env = loadEnv(mode, process.cwd(), "VITE_");

  // ubah value sesuai dengan tipenya
  const envValues = parseEnvVariables(env);

  // variabel tampungan
  const envObjects: ParsedEnv = {};

  // loop data .env
  for (const key in envValues) {
    // ambil value
    const value = envValues[key];

    // set key value dengan prefix
    envObjects[`import.meta.env.${key}`] = value;
  }

  return defineConfig({
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT),
    },
    define: envObjects,
    resolve: {
      alias: [
        {
          find: "@app",
          replacement: fileURLToPath(new URL("./src/app", import.meta.url)),
        },
        {
          find: "@assets",
          replacement: fileURLToPath(new URL("./src/assets", import.meta.url)),
        },
        {
          find: "@components",
          replacement: fileURLToPath(
            new URL("./src/components", import.meta.url)
          ),
        },
        {
          find: "@features",
          replacement: fileURLToPath(
            new URL("./src/features", import.meta.url)
          ),
        },
        {
          find: "@routes",
          replacement: fileURLToPath(new URL("./src/routes", import.meta.url)),
        },
        {
          find: "@utilities",
          replacement: fileURLToPath(
            new URL("./src/utilities", import.meta.url)
          ),
        },
      ],
    },
  });
};

export const parseEnvVariables = (env: Record<string, string>) => {
  const parsedVariables: ParsedEnv = {};

  for (const key in env) {
    if (env[key] === "true" || env[key] === "false") {
      parsedVariables[key] = env[key] === "true";
    } else if (!isNaN(Number(env[key]))) {
      parsedVariables[key] = parseFloat(env[key]);
    } else {
      parsedVariables[key] = `"${env[key]}"`;
    }
  }

  return parsedVariables;
};
