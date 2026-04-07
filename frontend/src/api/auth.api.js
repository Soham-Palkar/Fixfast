import api from "./axios";

export const registerApi = (payload) => api.post("/api/auth/user/register", payload);
export const loginApi = (payload) => api.post("/api/auth/user/login", payload);
export const providerRegisterApi = (payload) => api.post("/api/auth/provider/register", payload);
export const providerLoginApi = (payload) => api.post("/api/auth/provider/login", payload);
export const meApi = () => api.get("/api/auth/me");
