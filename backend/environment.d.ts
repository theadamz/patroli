declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      HOST: string;
      URL: string;
      DOMAIN: string;
      PORT: number;
      SECRET_KEY: string;
      DATABASE_URL: string;
    }
  }
}

export {};
