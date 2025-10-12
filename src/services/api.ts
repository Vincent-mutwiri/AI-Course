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
  updateProfile: async (name: string, email: string, avatar?: string) => {
    const { data } = await api.put("/user/profile", { name, email, avatar });
    return data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put("/user/change-password", { currentPassword, newPassword });
    return data;
  },
};

export const courseAPI = {
  getAll: async (filters?: { category?: string; level?: string; search?: string }) => {
    const { data } = await api.get("/courses", { params: filters });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },
  enroll: async (courseId: string) => {
    const { data } = await api.post(`/courses/${courseId}/enroll`);
    return data;
  },
};

export const enrollmentAPI = {
  getMyCourses: async () => {
    const { data } = await api.get("/enrollments/my-courses");
    return data;
  },
  getProgress: async (courseId: string) => {
    const { data } = await api.get(`/enrollments/${courseId}`);
    return data;
  },
  updateProgress: async (courseId: string, lessonId: string, completed: boolean) => {
    const { data } = await api.put(`/enrollments/${courseId}/progress`, { lessonId, completed });
    return data;
  },
  getStats: async () => {
    const { data } = await api.get("/enrollments/stats/overview");
    return data;
  },
};

export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/upload/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  getSignedUrl: async (fileName: string, fileType: string, folder: string) => {
    const { data } = await api.post("/upload/signed-url", { fileName, fileType, folder });
    return data;
  },
  deleteFile: async (fileUrl: string) => {
    const { data } = await api.delete("/upload", { data: { fileUrl } });
    return data;
  },
};

export const aiAPI = {
  chat: async (message: string, context?: Array<{ text: string; type: string }>) => {
    const { data } = await api.post("/ai/chat", { message, context });
    return data;
  },
};

export const quizAPI = {
  getQuiz: async (quizId: string) => {
    const { data } = await api.get(`/quizzes/${quizId}`);
    return data;
  },
  submitQuiz: async (quizId: string, answers: Array<{ selectedOption: number }>) => {
    const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return data;
  },
  getAttempts: async (quizId: string) => {
    const { data } = await api.get(`/quizzes/${quizId}/attempts`);
    return data;
  },
};

export const adminAPI = {
  getStats: async () => {
    const { data } = await api.get("/admin/stats");
    return data;
  },
  createCourse: async (courseData: any) => {
    const { data } = await api.post("/admin/courses", courseData);
    return data;
  },
  updateCourse: async (id: string, courseData: any) => {
    const { data } = await api.put(`/admin/courses/${id}`, courseData);
    return data;
  },
  deleteCourse: async (id: string) => {
    const { data } = await api.delete(`/admin/courses/${id}`);
    return data;
  },
  createQuiz: async (quizData: any) => {
    const { data } = await api.post("/admin/quizzes", quizData);
    return data;
  },
  updateQuiz: async (id: string, quizData: any) => {
    const { data } = await api.put(`/admin/quizzes/${id}`, quizData);
    return data;
  },
  deleteQuiz: async (id: string) => {
    const { data } = await api.delete(`/admin/quizzes/${id}`);
    return data;
  },
  getUsers: async () => {
    const { data } = await api.get("/admin/users");
    return data;
  },
};

export default api;
