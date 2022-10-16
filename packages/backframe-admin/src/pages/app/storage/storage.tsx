import { Route, Routes } from "react-router-dom";
import Header from "~/components/Header";
import Files from "./files";
import Provider from "./provider";
import Settings from "./settings";

export default function Storage() {
  return (
    <div>
      <Header links={["files", "provider", "settings"]} />
      <div className="px-10 py-5">
        <Routes>
          <Route path="files" element={<Files />} />
          <Route path="provider" element={<Provider />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
