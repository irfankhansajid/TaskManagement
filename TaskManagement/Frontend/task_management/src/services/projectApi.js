import api from "./Api";

export const projectApi = {
  getAllProject: () => api.get("/projects"),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (project) => api.post("/projects", project),
  updateProject: (id, project) => api.put(`/projects/${id}`, project),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};
