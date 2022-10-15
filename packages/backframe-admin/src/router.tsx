import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Other } from "./pages/Other";

import App from "~/pages/app";
import { Login } from "~/pages/login";
import { Register } from "~/pages/register";
import "./app.css";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="/app" element={<App />}>
        <Route path="metrics" element={<Other />} />
        <Route path="analytics" element={<Other />} />
        <Route path="logs" element={<Other />} />
        <Route path="auth" element={<Other />} />
        <Route path="database" element={<Other />} />
        <Route path="plugins" element={<Other />} />
        <Route path="storage" element={<Other />} />
        <Route path="interfaces" element={<Other />} />
      </Route>
      <Route path="/other" element={<Other />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
