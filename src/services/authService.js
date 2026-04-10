import axios from "@/api/axios";

export const authService = {
  login: (email, password) =>
    axios.post("/auth/login", { email, password }),

  register: (userData) =>
    axios.post("/auth/register", userData),

  forgotPassword: (email) =>
    axios.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    axios.post(`/auth/reset-password/${token}`, { password }),

  logout: () => axios.post("/auth/logout"),

  refresh: () => axios.post("/auth/refresh"),
};