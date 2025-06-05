import api from "./Api";

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  forgotPassword: (email) => api.post("/auth/forgot-password", email),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};
