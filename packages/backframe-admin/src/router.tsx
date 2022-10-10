import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Other } from "./pages/Other";

import { Login } from "~/pages/Login/Login";
import "./app.css";
import { Register } from "./pages/Register/Register";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/other" element={<Other />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
