import { api } from "./axios";

export const userApi = {
  me: () => api.get("/api/users/me"),
};
