import axios from "@/api/axios";

export const frameService = {
  getActive: () => axios.get("/frames"),
  getAll: () => axios.get("/frames/all"),
  create: (data) => axios.post("/frames", data),
  update: (id, data) => axios.put(`/frames/${id}`, data),
  delete: (id) => axios.delete(`/frames/${id}`),
};
