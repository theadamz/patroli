declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      HOST: string;
      URL: string;
      DOMAIN: string;
      PORT: number;
      SECRET_KEY: string;
      JWT_TOKEN_EXPIRE_REFRESH: string;
      JWT_TOKEN_EXPIRE_ACCESS: string;
      JWT_USE_ACCESS_TOKEN: string;
      DATABASE_URL: string;
    }
  }
}

export {};
