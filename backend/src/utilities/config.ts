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
};
