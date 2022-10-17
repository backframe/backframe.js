import { Navigate, Route, Routes } from "react-router-dom";
import Header from "~/components/Header";
import Installed from "./plugins/installed";
import Marketplace from "./plugins/marketplace";

export default function Plugins() {
  return (
    <div className="w-full">
      <Header links={["installed", "marketplace"]} />
      <div className="px-10 py-5">
        <Routes>
          <Route index element={<Navigate to="installed" />} />
          <Route path="installed" element={<Installed />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </div>
  );
}
