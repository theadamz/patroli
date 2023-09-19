import { apiBaseSlice } from "@features/api/apiSlice";

export const testApiSlice = apiBaseSlice.injectEndpoints({
  endpoints: (builder) => ({
    testHealthCheck: builder.query({
      query: () => "/v1/test/health-check",
    }),
  }),
});

export const { useTestHealthCheckQuery } = testApiSlice;

export const selectTesHealthCheckResult =
  testApiSlice.endpoints.testHealthCheck.select(undefined);
