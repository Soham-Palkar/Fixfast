import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fixfast_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to catch 403 ban responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403 && error.response.data?.banned) {
      // Store ban info so any page can show it
      const banData = {
        banned: true,
        message: error.response.data.message,
        banUntil: error.response.data.banUntil,
      };
      localStorage.setItem("fixfast_ban_info", JSON.stringify(banData));

      // Dispatch a custom event so active components can react immediately
      window.dispatchEvent(new CustomEvent("provider-banned", { detail: banData }));
    }
    return Promise.reject(error);
  }
);

export default api;