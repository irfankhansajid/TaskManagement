import api from "./Api";
  
  export const taskApi = {
        getAllTasks: () => api.get('/tasks'),
        getTaskById: (id) => api.get(`/tasks/${id}`),
        createTask : (task) => api.post('/tasks', task),
        updateTask : (id, task) => api.put(`/tasks/${id}`, task),
        deleteTask: (id) => api.delete(`/tasks/${id}`),
        updateStatus: (id, status) => api.put(`tasks/${id}/status?status=${status}`)
        
    }