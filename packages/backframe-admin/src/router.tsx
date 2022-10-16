import { Route, Routes } from "react-router-dom";

import { NotFound } from "./pages/NotFound";
import { Other } from "./pages/Other";

import App from "~/pages/app";
import { Login } from "~/pages/login";
import { Register } from "~/pages/register";
import "./app.css";
import { Index } from "./pages";
import Auth from "./pages/app/auth/auth";
import Overview from "./pages/app/overview/overview";
import Plugins from "./pages/app/plugins/plugins";
import Storage from "./pages/app/storage/storage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="/app" element={<App />}>
        <Route path="overview/*" element={<Overview />} />
        <Route path="analytics" element={<Other />} />
        <Route path="auth/*" element={<Auth />} />
        <Route path="database" element={<Other />} />
        <Route path="plugins/*" element={<Plugins />} />
        <Route path="storage/*" element={<Storage />} />
        <Route path="resources" element={<Other />} />
      </Route>
      <Route path="/other" element={<Other />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
