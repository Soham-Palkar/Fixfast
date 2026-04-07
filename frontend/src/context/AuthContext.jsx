import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("fixfast_token") || "");

  const isAuthed = !!token;

  async function login({ email, password }) {
    // change endpoint if your backend is different
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const t = res.data?.token || res.data?.accessToken || "";
    if (!t) throw new Error("Token not received from backend");
    setToken(t);
    localStorage.setItem("fixfast_token", t);
  }

  async function register({ name, email, password }) {
    // change endpoint if your backend is different
    const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    const t = res.data?.token || res.data?.accessToken || "";
    if (t) {
      setToken(t);
      localStorage.setItem("fixfast_token", t);
    }
  }

  function logout() {
    setToken("");
    localStorage.removeItem("fixfast_token");
  }

  const value = useMemo(
    () => ({ isAuthed, token, login, register, logout }),
    [isAuthed, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}