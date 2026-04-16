import axios from "@/api/axios";

export const sessionService = {
  getAllSessions: (date) =>
    axios.get(`/sessions${date ? `?date=${date}` : ""}`),
  generateSessions: (data) => axios.post("/sessions/generate", data),
  updateSession: (id, data) => axios.put(`/sessions/${id}`, data),
  deleteSession: (id) => axios.delete(`/sessions/${id}`),
};
