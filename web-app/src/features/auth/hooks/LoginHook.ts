import { store } from "@app/store";
import { testApiSlice } from "@features/auth/slices/testApiSlice";

export default function LoginHook() {
  const signIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    store.dispatch(testApiSlice.endpoints.testHealthCheck.initiate(undefined));
  };

  return {
    signIn,
  };
}
