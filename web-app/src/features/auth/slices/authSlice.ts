import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@features/auth/schemas/authSchema";
import { RootState } from "@app/store";

const initialState: AuthState = {
  user: null,
  _rt: null,
  _at: null,
  _cf: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      // set user info
      state.user = action.payload.user;

      // set tokens
      if (action.payload._rt) {
        state._rt = action.payload._rt;
      }
      state._at = action.payload._at ?? null;
      state._cf = action.payload._cf ?? null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state._rt = null;
      state._at = null;
      state._cf = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectRefreshToken = (state: RootState) => state.auth._rt;
export const selectAccessToken = (state: RootState) => state.auth._at;
export const selectCsrfToken = (state: RootState) => state.auth._cf;

export default authSlice.reducer;
