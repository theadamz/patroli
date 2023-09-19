import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoutes from "@routes/PublicRoutes";
import AppRoutes from "@routes/AppRoutes";

export default function MainRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/web-admin/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
