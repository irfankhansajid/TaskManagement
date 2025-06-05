import api from "./Api";

export const userApi = {
  getAllUsers: () => api.get("/users/all"),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
};
