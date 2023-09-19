import { RootState } from "@app/store";
import {
  setCredentials,
  clearCredentials,
} from "@features/auth/slices/authSlice";
import { createApi } from "@reduxjs/toolkit/dist/query/react";
import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: import.meta.env.VITE_USE_CORS ? "same-origin" : "include",
  prepareHeaders: (
    headers: Headers,
    {
      getState,
    }: Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">
  ) => {
    let token: string | null = null;

    if (import.meta.env.VITE_TOKEN_ACCESS_TYPE === "access") {
      token = (getState() as RootState).auth._at;
    } else {
      token = (getState() as RootState).auth._cf;
    }

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReatuh = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions = {}
) => {
  const request = await baseQuery(args, api, extraOptions);

  // if unauthorized
  if (request.error?.status === 401) {
    console.log("sending refesh token");
    // get new token
    const refreshRequest = await baseQuery(
      `/v1/refresh-token/${import.meta.env.VITE_TOKEN_ACCESS_TYPE}`,
      api,
      extraOptions
    );

    console.log(refreshRequest);

    if (refreshRequest.meta?.response?.status === 201) {
      const user = (api.getState() as RootState).auth.user!;
      const data = refreshRequest.data as { token: string };

      // store new token
      api.dispatch(
        setCredentials({
          user: {
            public_id: user.public_id,
            email: user.email,
            name: user.name,
            actor: user.actor,
            role_code: user.role_code,
            role_name: user.role_name,
          },
          _rt: null,
          _at:
            import.meta.env.VITE_TOKEN_ACCESS_TYPE === "access"
              ? data.token
              : null,
          _cf:
            import.meta.env.VITE_TOKEN_ACCESS_TYPE === "csrf"
              ? data.token
              : null,
        })
      );
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return request;
};

export const apiAppSlice = createApi({
  reducerPath: "apiApp",
  baseQuery: baseQueryWithReatuh,
  endpoints: () => ({}),
});

export const apiBaseSlice = createApi({
  reducerPath: "apiBase",
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
