import { Route, Routes } from "react-router-dom";
import Header from "~/components/Header";
import Logs from "./logs";
import Metrics from "./metrics";

export default function Overview() {
  const links = ["metrics", "stats", "health", "logs"];

  return (
    <div className="w-full">
      <Header links={links} />
      <div className="px-10 py-5">
        <Routes>
          <Route path="metrics" element={<Metrics />} />
          <Route path="stats" element={<Metrics />} />
          <Route path="health" element={<Metrics />} />
          <Route path="logs" element={<Logs />} />
        </Routes>
      </div>
    </div>
  );
}
