import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/public/Login.jsx";
import Register from "../pages/public/Register.jsx";
import Dashboard from "../pages/user/Dashboard.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
