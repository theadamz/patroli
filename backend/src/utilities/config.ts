export default {
  TOKEN_REFRESH_NAME: "_rt", // refresh_token name in cookie
  TOKEN_REFRESH_EXPIRE: "1d",
  TOKEN_ACCESS: false,
  TOKEN_ACCESS_NAME: "_at", // access token name in cookie
  TOKEN_ACCESS_EXPIRE: "5m",
  TOKEN_CSRF: true,
  TOKEN_CSRF_NAME: "_cf", // csrf token name in cookie
  TOKEN_CSRF_REGENERATE: true, // regenerate token every request done
  TOKEN_CSRF_REGENERATE_FLAG: false, // used for regenerate token, don't change this
  TOKEN_CSRF_EXPIRE: 0, // 0 = no time / never expire
  ALLOWED_METHOD: ["GET", "POST", "PUT", "DELETE"],
  FILE_PATH_TEMPLATES:
    process.env.NODE_ENV !== "production"
      ? "src/contents/templates"
      : "contents/templates",
  FILE_PATH_THUMBS:
    process.env.NODE_ENV !== "production"
      ? "src/contents/thumbs"
      : "contents/thumbs",
  FILE_PATH_TMP:
    process.env.NODE_ENV !== "production" ? "src/contents/tmp" : "contents/tmp",
  FILE_PATH_UPLOADS:
    process.env.NODE_ENV !== "production"
      ? "src/contents/uploads"
      : "contents/uploads",
  FILE_EXT_ALLOWED: ["jpeg", "jpg", "png", "pdf", "xlsx", "xls"],
  FILE_ALLOWED_MIME_TYPE: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  FILE_UPLOAD_MAX_SIZE: 1024 * 1024 * 2, // approx 2MB
  FILE_UPLOAD_MAX_FILEDS: 5,
  STATIC_PATH_CONTENTS: "contents",
  STATIC_PATH_PREFIX_CONTENTS: "/contents",
};
