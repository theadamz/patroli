/// <reference types="vite/client" />

interface ImportMetaEnv {
  // general
  VITE_APP_NAME: string;
  VITE_APP_NAME_SHORT: string;
  VITE_PORT: number;
  VITE_API_URL: string;
  VITE_MAINTENANCE: boolean;
  VITE_TOKEN_REFRESH_NAME: string;
  VITE_TOKEN_ACCESS_TYPE: "csrf" | "access";
  VITE_USE_CORS: boolean;

  // local
  VITE_LOCALE: string;
  VITE_DATE_FORMAT: string;
  VITE_DATETIME_FORMAT: string;
  VITE_TIME_FORMAT: string;
  VITE_THOUSAND_SEPARATOR: string;
  VITE_DECIMAL_SEPARATOR: string;
  VITE_PRECISION_LENGTH: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
