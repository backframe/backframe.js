import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "~/components/Header";
import Providers from "./auth/providers";
import Settings from "./auth/settings";
import Templates from "./auth/templates";
import Users from "./auth/users";

export default function Auth() {
  const location = useLocation();
  const links = ["users", "providers", "templates", "settings"];

  return (
    <div className="w-full">
      <Header links={links} />
      <div className="px-10 py-5">
        <Routes>
          <Route index element={<Navigate to="users" />} />
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
