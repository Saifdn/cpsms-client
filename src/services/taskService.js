import axios from "@/api/axios";

export const taskService = {
  getAll:  ()         => axios.get("/tasks"),
  getMy:   ()         => axios.get("/tasks/my"),
  create:  (data)     => axios.post("/tasks", data),
  update:  (id, data) => axios.put(`/tasks/${id}`, data),
  delete:  (id)       => axios.delete(`/tasks/${id}`),
};
