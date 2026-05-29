import axios from "@/api/axios";

const EP_BASE = import.meta.env.VITE_SOCKET_URL;

export const easyParcelService = {
  // Redirect browser to OAuth flow — not an API call
  connect: (userId) => {
    window.location.href = `${EP_BASE}/easyparcel/auth/connect?userId=${userId}&returnTo=/settings`;
  },

  // Get current connection status
  getStatus: () =>
    axios.get(`${EP_BASE}/easyparcel/status`, { withCredentials: true }),

  // Disconnect account
  disconnect: () =>
    axios.delete(`${EP_BASE}/easyparcel/disconnect`, { withCredentials: true }),
};