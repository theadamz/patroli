import { configureStore } from "@reduxjs/toolkit";
import { apiAppSlice, apiBaseSlice } from "@features/api/apiSlice";
import authReducer from "@features/auth/slices/authSlice";

export const store = configureStore({
  reducer: {
    [apiAppSlice.reducerPath]: apiAppSlice.reducer,
    [apiBaseSlice.reducerPath]: apiBaseSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiAppSlice.middleware,
      apiBaseSlice.middleware,
    ]),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDisPatch = typeof store.dispatch;
