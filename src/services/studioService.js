import axios from "@/api/axios";

export const studioService = {
  getAllStudios: () => axios.get("/studios"),

  createStudio: (data) => axios.post("/studios", data),

  updateStudio: (id, data) => axios.put(`/studios/${id}`, data),

  deleteStudio: (id) => axios.delete(`/studios/${id}`),

  toggleAvailability: (id, isAvailable) =>
    axios.put(`/studios/${id}/availability`, { isAvailable }),
};