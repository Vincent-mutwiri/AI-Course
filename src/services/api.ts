import axios from "axios";
import { getToken, removeToken } from "@/utils/token";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    return data;
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  verifyToken: async () => {
    const { data } = await api.get("/auth/verify");
    return data;
  },
  forgotPassword: async (email: string) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },
  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  },
};

export const userAPI = {
  updateProfile: async (name: string, email: string) => {
    const { data } = await api.put("/user/profile", { name, email });
    return data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put("/user/change-password", { currentPassword, newPassword });
    return data;
  },
};

export default api;
