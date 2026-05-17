import axios from "@/api/axios";

export const easyParcelService = {
  // Start OAuth flow
  connect: () => 
    axios.get("/easyparcel/auth/connect", { withCredentials: true }),

  // Get current connection status
  getStatus: () => 
    axios.get("/easyparcel/status", { withCredentials: true }),

  // Disconnect account
  disconnect: () => 
    axios.post("/easyparcel/auth/disconnect", {}, { withCredentials: true }),
};