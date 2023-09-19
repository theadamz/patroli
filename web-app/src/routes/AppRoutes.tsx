import PageNotFound from "@components/PageNotFound";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/users">
        <Route index element={<h1>Halaman utama user</h1>} />
        <Route path=":action" element={<h1>Halaman form user</h1>} />
        <Route path=":action/:id" element={<h1>Halaman edit user</h1>} />
      </Route>
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}
