import axios from "@/api/axios";

export const dashboardService = {
  getOverview: () => 
    axios.get("/dashboard/overview"),
};