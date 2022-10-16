import { Route, Routes, useLocation } from "react-router-dom";
import Header from "~/components/Header";
import Providers from "./providers";
import Settings from "./settings";
import Templates from "./templates";
import Users from "./users";

export default function Auth() {
  const location = useLocation();
  const links = ["users", "providers", "templates", "settings"];

  return (
    <div className="w-full">
      <Header links={links} />
      <div className="px-10 py-5">
        <Routes>
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
