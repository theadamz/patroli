import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@features/auth/pages/Login";
import PageNotFound from "@components/PageNotFound";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<h1>Halaman register</h1>} />
      <Route path="/forgot-password" element={<h1>Halaman lupa password</h1>} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}
