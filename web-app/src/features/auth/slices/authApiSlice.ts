import { apiAppSlice } from "@features/api/apiSlice";
import { LoginRequest } from "../schemas/authSchema";

export const authApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (request: LoginRequest) => ({
        url: "/v1/login",
        method: "POST",
        body: { ...request },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
