import axios from "@/api/axios";
import { format } from "date-fns";

export const sessionService = {
  getAllSessions: (date) => {
    if (!date) {
      return axios.get("/sessions");
    }

    // Ensure date is always in YYYY-MM-DD format
    const formattedDate = typeof date === "string" 
      ? date 
      : format(new Date(date), "yyyy-MM-dd");

    return axios.get(`/sessions?date=${formattedDate}`);
  },
  generateSessions: (data) => axios.post("/sessions/generate", data),
  updateSession: (id, data) => axios.put(`/sessions/${id}`, data),
  deleteSession: (id) => axios.delete(`/sessions/${id}`),
};
