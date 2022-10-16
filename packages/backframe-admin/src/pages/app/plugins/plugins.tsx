import { Route, Routes } from "react-router-dom";
import Header from "~/components/Header";
import Installed from "./installed";
import Marketplace from "./marketplace";

export default function Plugins() {
  return (
    <div className="w-full">
      <Header links={["installed", "marketplace"]} />
      <div className="px-10 py-5">
        <Routes>
          <Route path="installed" element={<Installed />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </div>
  );
}
